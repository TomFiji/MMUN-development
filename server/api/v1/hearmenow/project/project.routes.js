const projectController = require("./project.controller");
const express = require("express");
const router = express.Router();
const multer = require("multer");

const imageMulter = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
  // File size can be set here if needed
})

/*
 * Used to retrieve all projects
 *
 * Route: /project (GET)
 */
router.get("/", projectController.getAllProjects);

/*
 * Used to retrieve projects sorted by most trending (most for votes)
 *
 * Route: /project/trending (GET)
 */
router.get("/trending", projectController.getTrendingProjects);

/*
 * Used to retrieve projects in the user's country

 * Route: /project/local (GET)
 */
router.get("/local", projectController.getLocalProjects);

/*
 * Used to retrieve the top 15 projects of all SDGs
 *
 * Route: /project/sdg/top (GET)
 */
router.get("/sdg/top", projectController.getTopSdgProjects);

/*
 * Used to retrieve projects for a given SDG
 *
 * Route: /project/sdg/:sdg (GET)
 */
router.get("/sdg/:sdg", projectController.getSdgProjects);

/*
 * Used to create a new project
 *
 * Route: /project (POST)
 */
router.post("/", projectController.createProject);

/*
 * Used to vote on a project
 *
 * Route: /project/vote (POST)
 */
router.post("/vote", projectController.projectVote);


/*
 * Used to search for projects
 *
 * Route: /project/search (POST)
 */
router.post("/search", projectController.searchProjects);

/*
 * Used to upload an image
 *
 * Route: /project/image (POST)
 */
router.post("/image", imageMulter.single('image'), projectController.uploadImage);

/*
 * Used to remove an image
 *
 * Route: /project/image/:imageUrl (DELETE)
 */
router.delete("/image/*", projectController.removeImage);

/*
 * Used to get, update, and delete a specific project
 *
 * Route: /project/:projectId (GET, PUT, DELETE)
 */
router
  .route("/:projectId")
  .get(projectController.getProject)
  .put(projectController.updateProject)
  .delete(projectController.deleteProject);

module.exports = {router};
