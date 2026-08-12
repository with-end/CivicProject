const express = require("express");
const multer = require("multer");

const {
  createReport,
  getReports,
  getReport,
  getCompletedReports,
  updateReportStatus
} = require("../controller/reportController");

const router = express.Router();


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage
});



// Create report
router.post(
  "/:nagarId",
  upload.fields([{ name: "image" }]),
  createReport
);


// Get all reports for NagarPalika
router.get(
  "/:nagarId",
  getReports
);


// Get particular report
router.get(
  "/rep/:reportId",
  getReport
);


// Get completed reports
router.get(
  "/com/completed",
  getCompletedReports
);


// Change report status
router.patch(
  "/:id/status",
  updateReportStatus
);


module.exports = router;