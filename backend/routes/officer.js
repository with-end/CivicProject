const express = require("express");

const {
  getOfficerReports,
  updateOfficerStatus,
  approveReport
} = require("../controller/officerController.js");

const officerRouter = express.Router();


// get the assigned reports for the officer 
officerRouter.get(
  "/:officerId/reports",
  getOfficerReports
);



// update officer status
officerRouter.post(
  "/:officerId/status",
  updateOfficerStatus
);



// approve a report
officerRouter.post(
  "/:officerId/reports/:reportId/approve",
  approveReport
);


module.exports = officerRouter;