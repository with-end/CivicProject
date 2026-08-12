const Officer = require("../models/officer.js");
const Report = require("../models/reports.js");
const NagarPalika = require("../models/nagarPalica.js");



// to get the assigned reports for the officer
const getOfficerReports = async (req, res) => {
  try {
    const { officerId } = req.params;

    const officer = await Officer.findById(officerId);

    if (!officer) {
      return res.status(404).json({
        error: "Officer not found"
      });
    }

    const reports = await Report.find({
      _id: {
        $in: officer.assignedReports
      }
    });

    res.json(reports);

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch reports"
    });
  }
};



// update the status of the officer 
const updateOfficerStatus = async (req, res) => {
  try {
    const { officerId } = req.params;
    const { status } = req.body;

    const officer = await Officer.findByIdAndUpdate(
      officerId,
      { status },
      { new: true }
    );

    const nagar = await NagarPalika.findOne({
      nagarId: officer.nagarId
    });

    const deptKey = officer.department;


    if (status === "active") {

      if (deptKey) {

        const pendingReports =
          nagar[deptKey].pendingReports.splice(0, 3);

        for (let repId of pendingReports) {

          await Report.findByIdAndUpdate(
            repId,
            {
              assignedOfficer: officer._id
            }
          );

          officer.assignedReports.push(repId);
        }

        await nagar.save();
        await officer.save();
      }

    }

    else {

      for (let repId of officer.assignedReports) {

        await Report.findByIdAndUpdate(
          repId,
          {
            assignedOfficer: null
          }
        );

        await nagar[deptKey].pendingReports.push(repId);
      }

      officer.assignedReports = [];

      await nagar.save();
      await officer.save();
    }


    const io = req.app.get("io");

    io.emit("status", officer);


    res.json(officer);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Status update failed"
    });
  }
};



// approve a report 
const approveReport = async (req, res) => {
  try {

    const {
      officerId,
      reportId
    } = req.params;


    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status: "approved",
        approvalDate: Date.now()
      },
      {
        new: true
      }
    );


    if (!report) {
      return res.status(404).json({
        error: "Report not found"
      });
    }


    const department = report.department;

    const updateOps = {
      $inc: {}
    };

    updateOps.$inc[
      `${department}.stats.pending`
    ] = -1;

    updateOps.$inc[
      `${department}.stats.approved`
    ] = 1;


    await NagarPalika.findOneAndUpdate(
      {
        nagarId: report.nagarId
      },
      updateOps
    );


    const officer = await Officer.findByIdAndUpdate(
      officerId,
      {
        $pull: {
          assignedReports: reportId
        }
      },
      {
        new: true
      }
    );


    if (!officer) {
      return res.status(404).json({
        error: "Officer not found"
      });
    }


    await Officer.findByIdAndUpdate(
      officerId,
      {
        $pull: {
          assignedReports: reportId
        }
      }
    );


    const updatedOfficer = await Officer.findById(
      officerId
    );

    const io = req.app.get("io");


    if (updatedOfficer.assignedReports.length === 0) {

      updatedOfficer.status = "active";

      await updatedOfficer.save();

      io.emit("status", updatedOfficer);
    }


    res.json({
      success: true,
      report,
      officer: updatedOfficer
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Approval failed"
    });
  }
};


module.exports = {
  getOfficerReports,
  updateOfficerStatus,
  approveReport
};