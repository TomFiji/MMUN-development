const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const {
  EMAIL_TYPES,
  EMAIL_TEMPLATES,
  COOKIES,
  EMAIL_TEMPLATES_RELATIVE_PATHS,
} = require("../constants");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SEND_GRID_API_KEY,
    },
  })
);

/** SendEmail Function
 * @param to - Recipients
 * @param subject - Subject line
 * @param type - Name of the email templates (Custom for custom template)
 * @param content - HTML string (if the type is custom)/ Object of key and values pair to populate template
 * @returns promise
 */
const sendEmail = async (to, subject, type, content) => {
  let html = "";
  if (Object.keys(EMAIL_TYPES).includes(type)) {
    if (typeof content !== "object") {
      return Promise.reject(new Error("invalid options"));
    }
    if (!content.contactEmail) {
      content.contactEmail = process.env.SEND_GRID_EMAIL;
    }
    html = await renderTemplate(type, content);
  } else if (typeof content === "string") {
    html = content;
  } else {
    return Promise.reject(new Error("invalid type"));
  }
  return transporter.sendMail({
    to,
    subject,
    from: "HearMeNow Project " + process.env.SEND_GRID_EMAIL,
    html,
  });
};

/**
 *
 * @param type - Name of the email templates (Custom for custom template)
 * @param options - object of key and values pair to populate
 * @returns populated HTML string
 */
const renderTemplate = (type, options) => {
  let template;
  return new Promise((resolve) => {
    fs.readFile(
      path.join(...EMAIL_TEMPLATES_RELATIVE_PATHS[type]),
      (err, data) => {
        if (err) {
          template = EMAIL_TEMPLATES[type];
        } else {
          template = data.toString();
        }
        Object.keys(options).forEach((key) => {
          template = template.split("{{{" + key + "}}}").join(options[key]);
        });
        resolve(template);
      }
    );
  });
};

/**
 * Generates a random short token
 * @returns  A short token
 */
const generateEmailToken = () => {
  return Math.floor(Math.random() * 999999).toString();
};

/**
 * Generates CSRF Token with 32 digits of hexadecimal
 * @returns A token with 32 digits of hexadecimal
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(128).toString("hex");
};

/**
 * gets a user model and returns f/e safe user
 * @param {object} user user model
 * @returns {object} front-end safe user
 */
const getSafeUser = (user) => {
  const { password, __v, ...safeUser } = user._doc;
  return safeUser;
};

/**
 * gets a safe user/user model and returns user with limited info
 * @param {object} safeUser user model
 * @returns {object} limited user
 */
const getLimitedUser = (safeUser) => {
  const limitedUser = {
    _id: safeUser._id,
    group: safeUser.group,
    firstName: safeUser.firstName,
    lastName: safeUser.lastName,
    email: safeUser.email,
    phoneNumber: safeUser.phoneNumber,
    country: safeUser.country,
    birthYear: safeUser.birthYear,
    zipCode: safeUser.zipCode,
    profilePicture: safeUser.profilePicture,
    status: safeUser.status,
    authorType: safeUser.authorType,
  };
  return limitedUser;
};

const updateUserResponse = (user, res) => {
  const payload = {
    email: user.email,
    authorType: user.authorType,
    userId: user._id,
  };

  const token = jwt.sign(payload, process.env.JWT_TOKEN, {
    expiresIn: COOKIES.AUTH_EXP,
  });

  const safeUser = getSafeUser(user);
  const limitedUser = getLimitedUser(safeUser);

  const encryptedUser = String(
    CryptoJS.AES.encrypt(
      JSON.stringify(limitedUser),
      process.env.ENCRYPTION_KEY
    )
  );

  res.cookie(COOKIES.SESSION, `${encryptedUser}`, {
    maxAge: COOKIES.AUTH_EXP_MILLISECOND,
  });

  res.cookie(COOKIES.AUTH, token, {
    httpOnly: true,
    secure: process.env.PROD === "true" ? true : false,
    maxAge: COOKIES.AUTH_EXP_MILLISECOND,
    sameSite: true,
  });

  return safeUser;
};

const countProjectVote = (project) => {
  if (project._doc) {
    project = project._doc;
  }
  return {
    ...project,
    votes: {
      for: project.votes?.for?.length || 0,
      against: project.votes?.against?.length || 0,
      abstain: project.votes?.abstain?.length || 0,
    }
  }
}

const convertToProjectCard = (project) => {
  if (project._doc) {
    project = project._doc;
  }
  return {
    _id: project._id,
    title: project.title,
    subtitle: project.subtitle,
    images: project.images,
    sdg: project.sdg,
    country: project.country,
    author: project.author,
    datePublished: project.datePublished,
    openDate: project.openDate,
    closeDate: project.closeDate,
    isSponsored: project.isSponsored,
    createdBy: project.createdBy,
    votes: {
      for: project.votes?.for?.length || 0,
      against: project.votes?.against?.length || 0,
      abstain: project.votes?.abstain?.length || 0,
    }
  }
}

module.exports = {
  sendEmail,
  generateEmailToken,
  generateCsrfToken,
  getSafeUser,
  getLimitedUser,
  updateUserResponse,
  countProjectVote,
  convertToProjectCard,
};
