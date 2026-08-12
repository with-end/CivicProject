const express = require("express");
const router = express.Router();

const {
  getDepartmentOfficers,
  addOfficer,
  removeOfficer,
  departmentLogin,
} = require("../controller/departmentController");


// get all officers in a department 
router.get(
  "/:id/department/:dept/officers",
  getDepartmentOfficers
);


// add officer to department 
router.post(
  "/:id/department/:dept/add",
  addOfficer
);

// remove officer from department 
router.delete(
  "/:id/department/:dept/remove/:officerId",
  removeOfficer
);


// department login 
router.post(
  "/auth/:nagarId",
  departmentLogin
);


module.exports = router;