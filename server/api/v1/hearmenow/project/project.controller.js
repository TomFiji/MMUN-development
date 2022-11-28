const Project = require("./project.model");
const SDG = require("../sdg/sdg.model");
const {
  VOTE_TYPES,
  ERROR_CODES,
  AUTHOR_TYPES,
  PAGINATION_LIMIT,
  TOP_PROJECTS_CACHE,
  CACHE_UPDATE_DURATION,
} = require("../constants");
const { Storage } = require("@google-cloud/storage");
const path = require("path");
const uuid = require("uuid");
const streamifier = require("streamifier");
const {
  countProjectVote,
  convertToProjectCard,
} = require("../utilities/utilityFunctions");

// Retrieve a specific project
const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId);
    res.status(200).json(countProjectVote(project));
  } catch (error) {
    error.code = ERROR_CODES.PROJECT_NOT_FOUND;
    error.status = 404;
    next(error);
  }
};

// Retrieve all projects
const getAllProjects = (req, res, next) => {
  let pageNumber = isNaN(parseInt(req.query.page))
    ? 1
    : parseInt(req.query.page);

  Project.find()
    .skip((pageNumber - 1) * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .then((projects) => {
      res.status(200).json({ projects: projects.map(convertToProjectCard) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Retrieve the top 15 projects for all SDGs
const getTopSdgProjects = async (req, res, next) => {
  const showAll = parseInt(req.query.showAll) ?? 0;
  // checking cached data
  if (
    TOP_PROJECTS_CACHE.CACHED_DATA &&
    Date.now() - TOP_PROJECTS_CACHE.LAST_UPDATE < CACHE_UPDATE_DURATION &&
    TOP_PROJECTS_CACHE.SHOW_ALL === showAll
  ) {
    // loading from cached memory
    // updating cache every 3
    return res.status(200).json({ sdg: TOP_PROJECTS_CACHE.CACHED_DATA });
  }
  // old cache, fetching from database
  try {
    if (showAll) {
      await SDG.find(
        {},
        {
          projectId: {
            $slice: [0, PAGINATION_LIMIT],
          },
        }
      )
        .populate("projectId")
        .then((allSDGs) => {
          const formattedProjects = {};
          allSDGs.forEach((sdg) => {
            formattedProjects[sdg.code] =
              sdg.projectId.map(convertToProjectCard);
          });
          // updating cache
          TOP_PROJECTS_CACHE.CACHED_DATA = formattedProjects;
          TOP_PROJECTS_CACHE.LAST_UPDATE = Date.now();
          TOP_PROJECTS_CACHE.SHOW_ALL = showAll;
          res.status(200).json({ sdg: formattedProjects });
        });
    } else {
      await SDG.aggregate([
        { $unwind: "$projectId" },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projectList",
          },
        },
        {
          $match: {
            $and: [
              { "projectList.openDate": { $lt: new Date() } },
              { "projectList.closeDate": { $gt: new Date() } },
            ],
          },
        },
        { $unwind: "$projectList" },
        {
          $group: {
            _id: "$_id",
            code: {
              $addToSet: "$code",
            },
            projectList: {
              $push: "$projectList",
            },
          },
        },
      ]).then((allSDGs) => {
        const formattedProjects = {};
        allSDGs.forEach((sdg) => {
          const projectArray = sdg.projectList
            .sort(
              (a, b) =>
                new Date(b.datePublished).getTime() -
                new Date(a.datePublished).getTime()
            )
            .splice(0, PAGINATION_LIMIT);
          formattedProjects[sdg.code] = projectArray.map(convertToProjectCard);
        });
        // updating cache
        TOP_PROJECTS_CACHE.CACHED_DATA = formattedProjects;
        TOP_PROJECTS_CACHE.LAST_UPDATE = Date.now();
        TOP_PROJECTS_CACHE.SHOW_ALL = showAll;
        res.status(200).json({ sdg: formattedProjects });
      });
    }
  } catch (err) {
    err.status = 500;
    err.code = ERROR_CODES.UNEXPECTED_ERROR;
    return next(err);
  }
};

// Retrieve projects for a given SDG
const getSdgProjects = async (req, res, next) => {
  let pageNumber = isNaN(parseInt(req.query.page))
    ? 1
    : parseInt(req.query.page);
  const showAll = req.query.showAll ?? 0;

  try {
    if (parseInt(showAll)) {
      await SDG.findOne(
        { code: req.params.sdg },
        {
          projectId: {
            $slice: [(pageNumber - 1) * PAGINATION_LIMIT, PAGINATION_LIMIT],
          },
        }
      )
        .populate("projectId")
        .then((projects) => {
          res
            .status(200)
            .json({ projects: projects.projectId.map(convertToProjectCard) });
        });
    } else {
      await SDG.aggregate([
        { $match: { code: parseInt(req.params.sdg) } },
        { $unwind: "$projectId" },
        {
          $lookup: {
            from: "projects",
            localField: "projectId",
            foreignField: "_id",
            as: "projectList",
          },
        },
        {
          $match: {
            $and: [
              { "projectList.openDate": { $lt: new Date() } },
              { "projectList.closeDate": { $gt: new Date() } },
            ],
          },
        },
        { $unwind: "$projectList" },
        {
          $group: {
            _id: "$_id",
            projectList: {
              $addToSet: "$projectList",
            },
          },
        },
      ]).then((projects) => {
        const projectArray = projects[0].projectList
          .sort(
            (a, b) =>
              new Date(b.datePublished).getTime() -
              new Date(a.datePublished).getTime()
          )
          .splice((pageNumber - 1) * PAGINATION_LIMIT, PAGINATION_LIMIT)
          .map(convertToProjectCard);
        res.status(200).json({ projects: projectArray });
      });
    }
  } catch (err) {
    err.status = 500;
    err.code = ERROR_CODES.UNEXPECTED_ERROR;
    return next(err);
  }
};

// Create new project
const createProject = async (req, res, next) => {
  const {
    title,
    subtitle,
    images,
    description,
    impactStatement,
    abstract,
    sdg,
    country,
    openDate,
    closeDate,
    isSponsored,
  } = req.body;

  const project = new Project({
    title,
    subtitle,
    images,
    description,
    impactStatement,
    abstract,
    sdg,
    country,
    authorType: req.user._doc.authorType,
    datePublished: new Date().toISOString(),
    openDate,
    closeDate,
    isSponsored,
    createdBy: req.user._doc._id,
  });

  project
    .save()
    .then(() => {
      req.user.projects.push(project._id);
      req.user.save();
    })
    .then(() => {
      SDG.updateMany(
        { code: { $in: sdg } },
        {
          $push: {
            projectId: project._id,
          },
        }
      ).catch((err) => {
        throw err;
      });
    })
    .then(() => {
      // clearing cached data since it's out-dated
      TOP_PROJECTS_CACHE.CACHED_DATA = null;
      res.status(200).json({ project: countProjectVote(project) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Update an existing project
const updateProject = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);

  // If the user is not an admin and they are trying to update a project that doesn't belong to them - throw error
  if (
    req.user.authorType !== AUTHOR_TYPES.ADMIN &&
    req.userId !== String(project.createdBy)
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const {
    title,
    subtitle,
    images,
    description,
    impactStatement,
    abstract,
    sdg,
    country,
    openDate,
    closeDate,
    isSponsored,
  } = req.body;

  const toAdd = sdg.filter((el) => !project.sdg.includes(el));
  const toRemove = project.sdg.filter((el) => !sdg.includes(String(el)));

  project.title = title;
  project.subtitle = subtitle;
  project.images = images;
  project.description = description;
  project.impactStatement = impactStatement;
  project.abstract = abstract;
  project.sdg = sdg;
  project.country = country.toLowerCase().trim();
  project.openDate = openDate;
  project.closeDate = closeDate;
  project.isSponsored = isSponsored;

  project
    .save()
    .then(() => {
      // clearing cached data since it's out-dated
      TOP_PROJECTS_CACHE.CACHED_DATA = null;
      res.status(200).json({ project: countProjectVote(project) });
    })
    .then(async () => {
      toRemove.length &&
        SDG.updateMany(
          { code: { $in: toRemove } },
          {
            $pull: {
              projectId: project._id,
            },
          }
        ).catch((err) => {
          throw err;
        });

      toAdd.length &&
        SDG.updateMany(
          { code: { $in: toAdd } },
          {
            $push: {
              projectId: project._id,
            },
          }
        ).catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

// Deleting an existing project
const deleteProject = async (req, res, next) => {
  const project = await Project.findById(req.params.projectId);
  const projectSDGs = project.sdg;

  // If the user is not an admin and they are trying to delete a project that doesn't belong to them - throw error
  if (
    req.user.authorType !== AUTHOR_TYPES.ADMIN &&
    req.userId !== String(project.createdBy)
  ) {
    const err = new Error("Action is not authorized");
    err.status = 401;
    err.code = ERROR_CODES.NOT_AUTHORIZED;
    return next(err);
  }

  const imgUrls = project.images;

  project
    .delete()
    .then(async () => {
      SDG.updateMany(
        { code: { $in: projectSDGs } },
        {
          $pull: {
            projectId: project._id,
          },
        }
      ).catch((err) => {
        throw err;
      });
    })
    .then(() => {
      // clearing cached data since it's out-dated
      TOP_PROJECTS_CACHE.CACHED_DATA = null;
      const gc = new Storage({
        keyFilename: path.join(
          __dirname,
          "../" + process.env.CLOUD_STORAGE_KEY_FILE
        ),
        projectId: process.env.CLOUD_STORAGE_PROJECTID,
      });

      const imageBucket = gc.bucket(process.env.CLOUD_STORAGE_BUCKET_NAME);

      imgUrls.forEach((url) => {
        const imageName = url.substring(url.lastIndexOf("/") + 1);

        imageBucket
          .file(imageName)
          .delete()
          .catch((err) => {
            return next(err);
          });
      });
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((error) => {
      error.code = ERROR_CODES.PROJECT_NOT_FOUND;
      error.status = 404;
      return next(error);
    });
};

// Vote upon an existing project
const projectVote = async (req, res, next) => {
  try {
    const project = await Project.findById(req.body.projectId);

    const hasVotedFor = project.votes.for.includes(req.userId);
    const hasVotedAgainst = project.votes.against.includes(req.userId);
    const hasVotedAbstain = project.votes.abstain.includes(req.userId);

    if (
      (hasVotedFor && req.body.voteType == VOTE_TYPES.FOR) ||
      (hasVotedAgainst && req.body.voteType == VOTE_TYPES.AGAINST) ||
      (hasVotedAbstain && req.body.voteType == VOTE_TYPES.ABSTAIN)
    ) {
      const err = new Error(
        "User has already voted for this option on this project"
      );
      err.status = 409;
      err.code = ERROR_CODES.PROJECT_ALREADY_VOTED;
      return next(err);
    }

    if (req.body.voteType == VOTE_TYPES.FOR) {
      // Push new for vote to user and project
      project.votes.for.push(String(req.userId));
      req.user.votes.for.push(String(req.body.projectId));
    } else if (req.body.voteType == VOTE_TYPES.AGAINST) {
      // Push new against vote to user and project
      project.votes.against.push(String(req.userId));
      req.user.votes.against.push(String(req.body.projectId));
    } else if (req.body.voteType == VOTE_TYPES.ABSTAIN) {
      // Push new abstain vote to user and project
      project.votes.abstain.push(String(req.userId));
      req.user.votes.abstain.push(String(req.body.projectId));
    }

    // Remove old vote from user and project if present
    if (hasVotedFor && req.body.voteType !== VOTE_TYPES.FOR) {
      project.votes.for.pull({
        _id: req.userId,
      });
      req.user.votes.for.pull({
        _id: req.body.projectId,
      });
    } else if (hasVotedAgainst && req.body.voteType !== VOTE_TYPES.AGAINST) {
      project.votes.against.pull({
        _id: req.userId,
      });
      req.user.votes.against.pull({
        _id: req.body.projectId,
      });
    } else if (hasVotedAbstain && req.body.voteType !== VOTE_TYPES.ABSTAIN) {
      project.votes.abstain.pull({
        _id: req.userId,
      });
      req.user.votes.abstain.pull({
        _id: req.body.projectId,
      });
    }

    // Persist
    req.user.save();
    project.save();

    res.status(200).json({ project: countProjectVote(project) });
  } catch (err) {
    err.status = 500;
    err.code = ERROR_CODES.UNEXPECTED_ERROR;
    return next(err);
  }
};

const uploadImage = async (req, res, next) => {
  const gc = new Storage({
    keyFilename: path.join(
      __dirname,
      "../" + process.env.CLOUD_STORAGE_KEY_FILE
    ),
    projectId: process.env.CLOUD_STORAGE_PROJECTID,
  });

  const imageBucket = gc.bucket(process.env.CLOUD_STORAGE_BUCKET_NAME);

  const imageName = uuid.v4() + req.file.originalname;

  const file = imageBucket.file(imageName);

  const fileStream = file.createWriteStream();

  streamifier
    .createReadStream(req.file.buffer)
    .on("error", (err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    })
    .pipe(fileStream)
    .on("finish", (resp) => {
      res.status(200).json({
        imageUrl: process.env.CLOUD_STORAGE_BASE_URL + imageName,
      });
    });
};

const removeImage = async (req, res, next) => {
  const url = decodeURIComponent(req.params[0]);
  const imageName = url.substring(url.lastIndexOf("/") + 1);

  const gc = new Storage({
    keyFilename: path.join(
      __dirname,
      "../" + process.env.CLOUD_STORAGE_KEY_FILE
    ),
    projectId: process.env.CLOUD_STORAGE_PROJECTID,
  });

  const imageBucket = gc.bucket(process.env.CLOUD_STORAGE_BUCKET_NAME);

  imageBucket
    .file(imageName)
    .delete()
    .then(res.status(200).json())
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

const searchProjects = async (req, res, next) => {
  let pageNumber = isNaN(parseInt(req.query.page))
    ? 1
    : parseInt(req.query.page);
  const { text, country, sdg } = req.body;
  const query = {};
  if (text && text.length >= 3) {
    query.$and = [
      {
        $or: [
          { title: { $regex: text } },
          { subtitle: { $regex: text } },
          { impactStatement: { $regex: text } },
        ],
      },
    ];
  }
  if (country && country.length >= 2) {
    if (!query.$and) {
      query.$and = [];
    }
    query.$and.push({ country: { $regex: country.toLowerCase().trim() } });
  }
  if (sdg && !isNaN(parseInt(sdg)) && parseInt(sdg) > 0 && parseInt(sdg) < 18) {
    if (!query.$and) {
      query.$and = [];
    }
    query.$and.push({ sdg: parseInt(sdg) });
  }

  Project.find(query)
    .skip((pageNumber - 1) * PAGINATION_LIMIT * 2)
    .limit(PAGINATION_LIMIT * 2)
    .then((projects) => {
      res.status(200).json({ projects: projects.map(convertToProjectCard) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

const getTrendingProjects = (req, res, next) => {
  let pageNumber = isNaN(parseInt(req.query.page))
    ? 1
    : parseInt(req.query.page);

  const showAll = req.query.showAll ?? 0;

  const match = parseInt(showAll)
    ? {}
    : {
        closeDate: { $gt: new Date() },
        openDate: { $lt: new Date() },
      };

  Project.aggregate([
    { $match: match },
    {
      $addFields: {
        length: { $size: "$votes.for" },
      },
    },
    { $sort: { length: -1 } },
  ])
    .skip((pageNumber - 1) * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .then((projects) => {
      res.status(200).json({ projects: projects.map(convertToProjectCard) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

const getLocalProjects = (req, res, next) => {
  let pageNumber = isNaN(parseInt(req.query.page))
    ? 1
    : parseInt(req.query.page);

  const showAll = req.query.showAll ?? 0;

  const match = parseInt(showAll)
    ? { country: req.user.country }
    : {
        country: req.user.country,
        closeDate: { $gt: new Date() },
        openDate: { $lt: new Date() },
      };

  Project.find(match)
    .sort({ datePublished: -1 })
    .skip((pageNumber - 1) * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .then((projects) => {
      res.status(200).json({ projects: projects.map(convertToProjectCard) });
    })
    .catch((err) => {
      err.status = 500;
      err.code = ERROR_CODES.UNEXPECTED_ERROR;
      return next(err);
    });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  getProject,
  deleteProject,
  projectVote,
  uploadImage,
  removeImage,
  getSdgProjects,
  getTopSdgProjects,
  searchProjects,
  getTrendingProjects,
  getLocalProjects,
};
