const reportController = require("./report.controller");
const express = require("express");
const router = express.Router();

/*
 * Used to retrieve all reports
 *
 * Route: /report (GET)
 */
router.get("/", reportController.getAllReports);

/*
 * Used to create a report
 *
 * Route: /report (POST)
 */
router.post("/", reportController.createReport);

/*
 * Used to delete a report
 *
 * Route: /report/:reportId (DELETE)
 */
router.delete("/:reportId", reportController.deleteReport);

module.exports = {router};