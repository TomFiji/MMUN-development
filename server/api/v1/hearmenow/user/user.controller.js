const {
  COOKIES,
  STATUS,
  ERROR_CODES,
  AUTHOR_TYPES,
  EMAIL_SUBJECTS,
  EMAIL_TYPES,
  PAGINATION_LIMIT,
  GROUP_SEARCH_MAX_RESULT,
} = require("../constants");
const User = require("./user.model");
const Group = require("../group/group.model");
const bcrypt = require("bcrypt");
const {
  sendEmail,
  generateEmailToken,
  generateCsrfToken,
  getSafeUser,
  updateUserResponse,
  convertToProjectCard
} = require("../utilities/utilityFunctions");
const { Storage } = require("@google-cloud/storage");
const path = require("path");


// Retrieve a specific user
const getUser = async (req, res, next) => {
  // If the user is not an admin and they are trying to view a different user throw error
  if (
    req.user.authorType === AUTHOR_TYPES.STUDENT || req.user.authorType === AUTHOR_TYPES.USER || req.user.authorType === AUTHOR_TYPES.ORGANIZATION &&
    req.userId !== req.params.userId
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const user = await User.findById(req.params.userId);

  res.status(200).json(user._doc);
};

// Retrieves all users
const getAllUsers = async (req, res, next) => {
  // If the user is not an admin - throw error
  if (req.user.authorType === AUTHOR_TYPES.STUDENT || req.user.authorType === AUTHOR_TYPES.USER || req.user.authorType === AUTHOR_TYPES.ORGANIZATION) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  let pageNumber = parseInt(req.query.page);

  if (isNaN(pageNumber)) {
    pageNumber = 1;
  }

  User.find()
    .skip((pageNumber - 1) * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .then((users) => {
      res.status(200).json({ users: users.map((user) => getSafeUser(user)) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Create a new user
const createUser = async (req, res, next) => {
  const plainTextPassword = req.body.password;

  // First check if there's an account with this email
  if (await User.findOne({ email: req.body.email }).exec()) {
    const err = new Error(
      "The entered email is already associated with an account"
    );
    err.status = 409;
    err.code = ERROR_CODES.ACCOUNT_ALREADY_EXISTS;
    return next(err);
  }
  
  // search for group
  const groupName = req.body.group?.toLowerCase().trim();
  const group = await Group.findOne({ name: groupName });
  if (req.body.authorType === AUTHOR_TYPES.STUDENT && !group) {
    const err = new Error("could not find group");
    err.status = 404;
    err.code = ERROR_CODES.INVALID_GROUP;
    return next(err);
  }
  // Create a new user with a hashed password
  bcrypt.hash(plainTextPassword, process.env.SALT, async (err, hash) => {
    if (err) {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }

    const newEmailToken = generateEmailToken();
    const user = new User({
      group: groupName,
      firstName: req.body.firstName.toLowerCase().trim(),
      lastName: req.body.lastName.toLowerCase().trim(),
      email: req.body.email.toLowerCase().trim(),
      password: hash,
      phoneNumber: req.body.phoneNumber,
      country: req.body.country.toLowerCase().trim(),
      birthDate: req.body.birthDate,
      zipCode: req.body.zipCode,
      authorType: req.body.authorType,
      status: STATUS.PENDING,
      metadata: {
        newUserToken: newEmailToken,
      },
    });
    try {
      // sending emails
      const requestContent = {
        name: user.firstName,
        token: newEmailToken,
      };
      // welcome email
      await sendEmail(
        user.email,
        EMAIL_SUBJECTS.WELCOME,
        EMAIL_TYPES.WELCOME,
        requestContent
      );
      // security token email
      await sendEmail(
        user.email,
        EMAIL_SUBJECTS.CONFIRM_EMAIL,
        EMAIL_TYPES.CONFIRM_EMAIL,
        requestContent
      );
    } catch (error) {
      error.status = 500;
      error.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(error);
    }
    user
      .save()
      .then(() => {
        if (req.body.authorType === AUTHOR_TYPES.STUDENT) {
          group.students.push(user._id);
          return group.save();
        } else if (req.body.authorType === AUTHOR_TYPES.TEACHER){
          if (group) {
            group.teachers.push({
              _id: user._id,
              name: user.firstName + " " + user.lastName,
            });
            return group.save();
          } else {
            const newGroup = new Group({
              name: groupName,
              teachers: [
                { _id: user._id, name: user.firstName + " " + user.lastName },
              ],
            });
            return newGroup.save();
          }
        }
      })
      .then(() => {
        const safeUser = updateUserResponse(user, res);
        res.status(200).json({ user: safeUser });
      })
      .catch((err) => next(err));
  });
};

// Update an existing user
const updateUser = async (req, res, next) => {
  // If the user is not an admin and they are trying to update a profile which is not theirs - throw error
  if (
    req.user.authorType === AUTHOR_TYPES.STUDENT || req.user.authorType === AUTHOR_TYPES.USER || req.user.authorType === AUTHOR_TYPES.ORGANIZATION &&
    req.userId !== req.params.userId
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const user = await User.findById(req.params.userId);
  const { group, phoneNumber, country, zipCode, profilePicture } = req.body;
  const oldGroup = user.group.toLowerCase().trim();
  const oldAuthorType = user.authorType;
  user.group = group.toLowerCase().trim();
  user.country = country.toLowerCase().trim();
  user.profilePicture = profilePicture;
  user.phoneNumber = phoneNumber;
  user.zipCode = zipCode;

  if (req.user.authorType === AUTHOR_TYPES.ADMIN || req.user.authorType === AUTHOR_TYPES.TEACHER) {
    const { email, firstName, lastName, birthDate, authorType } = req.body;
    user.firstName = firstName.toLowerCase().trim();
    user.lastName = lastName.toLowerCase().trim();
    user.birthDate = birthDate;
    user.authorType = authorType;
    user.email = email.toLowerCase().trim();
  }

  const isNewGroup = user.group !== oldGroup;
  const authorChanged = user.authorType !== oldAuthorType;
  // is user group changed
  if (isNewGroup || authorChanged) {
    try {
      // search for group
      const loadedGroup = await Group.findOne({ name: group.toLowerCase().trim() });
      if (user.authorType === AUTHOR_TYPES.STUDENT && !loadedGroup) {
        const err = new Error("could not find group");
        err.status = 404;
        err.code = ERROR_CODES.INVALID_GROUP;
        return next(err);
      }
      // adding to new group
      if (user.authorType === AUTHOR_TYPES.STUDENT) {
        loadedGroup.students.push(user._id);
        await loadedGroup.save();
      } else {
        if (loadedGroup) {
          loadedGroup.teachers.push({
            _id: user._id,
            name: user.firstName + " " + user.lastName,
          });
          await loadedGroup.save();
        } else {
          const newGroup = new Group({
            name: groupName,
            teachers: [
              { _id: user._id, name: user.firstName + " " + user.lastName },
            ],
          });
          await newGroup.save();
        }
      }
      // removing from old group
      const loadedOldGroup = await Group.findOne({
        name: oldGroup.toLowerCase().trim(),
      });
      if (loadedOldGroup) {
        if (oldAuthorType === AUTHOR_TYPES.STUDENT) {
          loadedOldGroup.students = loadedOldGroup.students.filter(
            (id) => id.toString() !== user._id.toString()
          );
        } else {
          loadedOldGroup.teachers = loadedOldGroup.teachers.filter(
            (teacher) => teacher._id.toString() !== user._id.toString()
          );
        }
        await loadedOldGroup.save();
      }
    } catch (error) {
      error.status = 500;
      error.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(error);
    }
  }
  user
    .save()
    .then((user) => {
      res.status(200).json({ user: getSafeUser(user) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Delete an existing user
const deleteUser = async (req, res, next) => {
  // If the user is not an admin and they are trying to delete a profile which is not theirs - throw error
  if (
    req.user.authorType === AUTHOR_TYPES.STUDENT || req.user.authorType === AUTHOR_TYPES.USER || req.user.authorType === AUTHOR_TYPES.ORGANIZATION &&
    req.userId !== req.params.userId
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const userToDelete = await User.findById(req.params.userId);

  const profilePicture = userToDelete.profilePicture;

  // removing from group
  const group = await Group.findOne({ name: userToDelete.group.toLowerCase() });
  if (group) {
    if (userToDelete.authorType === AUTHOR_TYPES.STUDENT) {
      group.students = group.students.filter(
        (id) => id.toString() !== userToDelete._id.toString()
      );
    } else {
      group.teachers = group.teachers.filter(
        (teacher) => teacher._id.toString() !== userToDelete._id.toString()
      );
    }
    await group.save();
  }

  userToDelete
    .delete()
    .then(() => {
      if (profilePicture) {
        const gc = new Storage({
          keyFilename: path.join(
            __dirname,
            "../" + process.env.CLOUD_STORAGE_KEY_FILE
          ),
          projectId: process.env.CLOUD_STORAGE_PROJECTID,
        });
  
        const imageBucket = gc.bucket(process.env.CLOUD_STORAGE_BUCKET_NAME);
        const imageName = profilePicture.substring(
          profilePicture.lastIndexOf("/") + 1
        );
  
         return imageBucket
          .file(imageName)
          .delete()
      } else {
        return Promise.resolve(true)
      }
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Authenticates a user for login
const login = async (req, res, next) => {
  const emailInput = req.body.email.toLowerCase().trim();
  const passwordInput = req.body.password;

  const user = await User.findOne({ email: emailInput }).exec();

  if (!user) {
    const err = new Error("The user credentials is incorrect");
    err.status = 401;
    err.code = ERROR_CODES.INVALID_CREDENTIALS;
    return next(err);
  }

  bcrypt.hash(passwordInput, process.env.SALT, function (err, hash) {
    if (err) {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }
    if (user.password === hash) {
      if (user.status === STATUS.BANNED) {
        const err = new Error("User account is banned");
        err.status = 403;
        err.code = ERROR_CODES.BANNED;
        return next(err);
      }
      const safeUser = updateUserResponse(user, res);
      return res.status(200).json({ user: safeUser });
    } else {
      const err = new Error("The user credentials is incorrect");
      err.status = 401;
      err.code = ERROR_CODES.INVALID_CREDENTIALS;
      return next(err);
    }
  });
};

// Logout the current user
const logout = (req, res, next) => {
  res.cookie(COOKIES.AUTH, "");
  res.cookie(COOKIES.SESSION, "");
  res.status(200).json({ message: "logged out" });
};

// Used to get a user activity (user with populated project reference fields)
const getUserActivities = async (req, res, next) => {
  // If the user is not an admin and they are trying to view a different user throw error
  if (
    req.user.authorType === AUTHOR_TYPES.STUDENT || req.user.authorType === AUTHOR_TYPES.USER || req.user.authorType === AUTHOR_TYPES.ORGANIZATION &&
    req.userId !== req.params.userId
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const user = await User.findById(req.params.userId)
    .populate("projects")
    .populate("favoriteProjects")
    .populate("votes.for")
    .populate("votes.against")
    .populate("votes.abstain");

    const userActivities = { votes: {} };
    userActivities.favoriteProjects = user.favoriteProjects?.map(convertToProjectCard) || 0;
    userActivities.projects = user.projects?.map(convertToProjectCard) || 0;
    userActivities.votes.for = user.votes?.for?.map(convertToProjectCard) || 0;
    userActivities.votes.against = user.votes?.against?.map(convertToProjectCard) || 0;
    userActivities.votes.abstain = user.votes?.abstain?.map(convertToProjectCard) || 0;
    res.status(200).json(userActivities);
};

const addToFavorites = (req, res, next) => {
  const projectId = req.body.projectId;

  if (req.user.favoriteProjects.includes(projectId)) {
    const err = new Error("Project is already in user's favorite list");
    err.status = 409;
    err.code = ERROR_CODES.PROJECT_ALREADY_FAVORITED;
    return next(err);
  }

  req.user.favoriteProjects.push(projectId);
  req.user.save();

  res.status(200).json();
};

const removeFromFavorites = (req, res, next) => {
  const projectId = req.params.projectId;

  if (req.user.favoriteProjects.includes(projectId)) {
    req.user.favoriteProjects.splice(
      req.user.favoriteProjects.indexOf(String(req.params.projectId)),
      1
    );
    req.user.save();
  }

  res.status(200).json();
};

// Forgot password
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    const err = new Error("User cannot be found with this email");
    err.status = 401;
    err.code = ERROR_CODES.INVALID_CREDENTIALS;
    return next(err);
  }
  const emailToken = generateEmailToken();
  const csrfToken = generateCsrfToken();
  expirationToken = Date.now() + 3 * 3600000;
  const requestContent = {
    name: user.firstName,
    email: user.email,
    token: emailToken,
  };
  user.metadata = {
    emailToken,
    csrfToken,
    expirationToken,
  };
  try {
    await user.save();
    await sendEmail(
      user.email,
      EMAIL_SUBJECTS.RESET_PASSWORD,
      EMAIL_TYPES.RESET_PASSWORD,
      requestContent
    );
  } catch (error) {
    error.status = 500;
    error.code = ERROR_CODES.UNEXPECTED_ERROR;
    return next(error);
  }
  res.cookie(COOKIES.CSRF, csrfToken, {
    httpOnly: true,
    secure: process.env.PROD === "true" ? true : false,
    maxAge: 3 * 3600 * 1000,
    sameSite: true,
  });
  res.json({ message: "Request success" });
};

const resetPassword = async (req, res, next) => {
  const { email, emailToken, password } = req.body;
  const csrfCookie = req.cookies[COOKIES.CSRF];
  if (!csrfCookie) {
    const err = new Error("Token has been expired or does not exist");
    err.status = 400;
    err.code = ERROR_CODES.BAD_REQUEST;
    return next(err);
  }
  const user = await User.findOne({ email }).exec();
  const userCsrfToken = user.metadata?.csrfToken;
  const userEmailToken = user.metadata?.emailToken;
  const expirationToken = user.metadata?.expirationToken;

  if (userCsrfToken !== csrfCookie) {
    const err = new Error("Token has been expired or does not exist 01");
    err.status = 400;
    err.code = ERROR_CODES.BAD_REQUEST;
    return next(err);
  }
  if (emailToken.toString() !== userEmailToken.toString()) {
    const err = new Error("Token has been expired or does not exist 02");
    err.status = 400;
    err.code = ERROR_CODES.BAD_REQUEST;
    return next(err);
  }
  if (expirationToken < Date.now()) {
    const err = new Error("Token has been expired or does not exist 03");
    err.status = 400;
    err.code = ERROR_CODES.BAD_REQUEST;
    return next(err);
  }
  bcrypt.hash(password, process.env.SALT, async (err, hashedPassword) => {
    if (err) {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }

    user.password = hashedPassword;
    user.metadata = {};
    await user.save();
    res.cookie(COOKIES.CSRF, "");
    res.json({ message: "Password has been updated" });
  });
};

const changePassword = async (req, res, next) => {
  const { password, newPassword } = req.body;
  bcrypt.hash(password, process.env.SALT, async (err, hashedPassword) => {
    if (err) {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }
    if (hashedPassword === req.user.password) {
      bcrypt.hash(
        newPassword,
        process.env.SALT,
        async (err, newHashedPassword) => {
          if (err) {
            err.status = 500;
            err.code = ERROR_CODES.UNEXPECTED_ERROR;
            return next(err);
          }
          req.user.password = newHashedPassword;
          await req.user.save();
          res.json({ message: "Password has been updated" });
        }
      );
    } else {
      const error = new Error("Not Authenticated");
      error.status = 401;
      error.code = ERROR_CODES.NOT_AUTHENTICATED;
      return next(error);
    }
  });
};

const updateEmail = async (req, res, next) => {
  const { newEmail } = req.body;
  const newEmailToken = generateEmailToken();
  const requestContent = {
    name: req.user.firstName,
    token: newEmailToken,
  };
  req.user.metadata.newEmail = newEmail;
  req.user.metadata.newEmailToken = newEmailToken;
  req.user.metadata.newEmailExpiration = Date.now() + 3 * 3600000;
  req.user.save();
  try {
    await sendEmail(
      newEmail,
      EMAIL_SUBJECTS.CONFIRM_EMAIL,
      EMAIL_TYPES.CONFIRM_EMAIL,
      requestContent
    );
  } catch (error) {
    error.status = 500;
    error.code = ERROR_CODES.UNEXPECTED_ERROR;
    return next(error);
  }
  return res.json({ message: "new code has been sent" });
};

const confirmEmail = async (req, res, next) => {
  const { email, emailToken = "" } = req.body;
  const isNewUser = req.user.status === STATUS.PENDING;
  if (isNewUser) {
    if (email !== req.user.email) {
      const err = new Error("Invalid Operation");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    if (emailToken.toString() !== req.user.metadata?.newUserToken) {
      const err = new Error("Token has been expired or does not exist 01");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    req.user.metadata.newUserToken = "";
    req.user.status = STATUS.ACTIVE;
    req.user.save();
    const safeUser = updateUserResponse(req.user, res);
    return res.status(200).json({ user: safeUser });
  } else {
    if (email !== req.user.metadata?.newEmail) {
      const err = new Error("Token has been expired or does not exist 02");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    if (emailToken.toString() !== req.user.metadata?.newEmailToken) {
      const err = new Error("Token has been expired or does not exist 03");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    if (req.user.metadata?.newEmailExpiration < Date.now()) {
      const err = new Error("Token has been expired or does not exist 04");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    req.user.metadata.newEmail = "";
    req.user.metadata.newEmailToken = "";
    req.user.metadata.newEmailExpiration = 0;
    req.user.email = email;
    req.user.save();
    const safeUser = updateUserResponse(req.user, res);
    return res.status(200).json({ user: safeUser });
  }
};

const resendToken = async (req, res, next) => {
  const { email } = req.body;
  const isNewUser = req.user.status === STATUS.PENDING;
  const newEmailToken = generateEmailToken();
  const requestContent = {
    name: req.user.firstName,
    token: newEmailToken,
  };
  if (!req.user.metadata) {
    req.user.metadata = {};
  }
  if (isNewUser) {
    if (email !== req.user.email) {
      const err = new Error("Invalid Operation");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    req.user.metadata.newUserToken = newEmailToken;
    await req.user.save();
    try {
      // sending email
      await sendEmail(
        email,
        EMAIL_SUBJECTS.CONFIRM_EMAIL,
        EMAIL_TYPES.CONFIRM_EMAIL,
        requestContent
      );
    } catch (error) {
      error.status = 500;
      error.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(error);
    }
    return res.json({ message: "new code has been sent" });
  } else {
    if (email !== req.user.metadata?.newEmail) {
      const err = new Error("Invalid Operation");
      err.status = 400;
      err.code = ERROR_CODES.BAD_REQUEST;
      return next(err);
    }
    const newEmailExpiration = Date.now() + 3 * 3600000;
    req.user.metadata.newEmailToken = newEmailToken;
    req.user.metadata.newEmailExpiration = newEmailExpiration;
    try {
      req.user.save();
      await sendEmail(
        email,
        EMAIL_SUBJECTS.CONFIRM_EMAIL,
        EMAIL_TYPES.CONFIRM_EMAIL,
        requestContent
      );
    } catch (error) {
      error.status = 500;
      error.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(error);
    }
    return res.json({ message: "new code has been sent" });
  }
};

const searchGroups = async (req, res, next) => {
  const searchQuery = req.params.searchQuery?.toLowerCase().trim();
  const query = {
    $or: [
      { name: { $regex: searchQuery } },
      { "teachers.name": { $regex: searchQuery } },
    ],
  };
  Group.find(query, { name: 1, _id: 0 })
    .limit(GROUP_SEARCH_MAX_RESULT)
    .then((groups) => {
      res.status(200).json({ groups });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

const banUser = async (req, res, next) => {
  if (req.user.authorType === AUTHOR_TYPES.ADMIN) {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      const err = new Error("could not find user");
      err.status = 404;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }
    user.status = STATUS.BANNED;
    user.save();
    res.json({ message: "user has been banned" });
  } else {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }
};

const unBanUser = async (req, res, next) => {
  if (req.user.authorType === AUTHOR_TYPES.ADMIN) {
    const { userId } = req.body;
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      const err = new Error("could not find user");
      err.status = 404;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    }
    if (user.metadata?.newUserToken) {
      user.status = STATUS.PENDING;
    } else {
      user.status = STATUS.ACTIVE;
    }
    user.save();
    res.json({ message: "user has been banned" });
  } else {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  logout,
  getUserActivities,
  addToFavorites,
  removeFromFavorites,
  forgotPassword,
  resetPassword,
  changePassword,
  confirmEmail,
  updateEmail,
  resendToken,
  searchGroups,
  banUser,
  unBanUser,
};
