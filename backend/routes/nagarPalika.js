const express = require("express");

const router = express.Router();

const {
  getAllNagarPalikas,
  addNagarPalika,
  updateNagarPalika,
  deleteNagarPalika,
  findNagarPalikaByLocation,
  getNagarPalikaBoundary,
  getNagarPalikaReports,
  getHomePageData,
} = require("../controller/nagarPalikaController");



// get all nagar palikas
router.get("/", getAllNagarPalikas);



// add new nagar palika
router.post("/", addNagarPalika);


// update nagar palika
router.put("/:id", updateNagarPalika);


// delete nagar palika
router.delete("/:id", deleteNagarPalika);


// find nagar plika by location
router.get("/find", findNagarPalikaByLocation);


// get the nagar palika boundary for a given nagarId
router.get(
  "/:nagarId/boundary",
  getNagarPalikaBoundary
);


// get reports for a given nagarid
router.get(
  "/:nagarId/reports/:type",
  getNagarPalikaReports
);


// get data about the nagarpalika 
router.get(
  "/home/:variable",
  getHomePageData
);


module.exports = router;