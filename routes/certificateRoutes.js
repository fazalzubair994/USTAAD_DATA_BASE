const express = require("express");
const {
  certificateVerification,
  checkCertificateExists,
  getAllCertificates,
} = require("../controllers/certificateController.js");

const router = express.Router();

router.get("/getAll", getAllCertificates);
router.post("/checkCertificate", checkCertificateExists);
router.patch("/verifyCertificate", certificateVerification);
// Other user routes...

module.exports = router;
