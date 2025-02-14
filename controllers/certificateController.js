const fs = require("fs");
const path = require("path");
// Path to the Certificates JSON file
const certificatesFilePath = path.join(__dirname, "../data/Certificates.json");
// Load the user data from the JSON file

const getAllCertificates = (req, res) => {
  let certificates = readCertificates();
  if (certificates) {
    return res.status(201).json({ certificates: certificates });
  } else {
    return res.status(404).send("No User found.");
  }
};

// Function to read the certificates file
const readCertificates = () => {
  if (!fs.existsSync(certificatesFilePath)) {
    return null;
  }

  let data = fs.readFileSync(certificatesFilePath, "utf-8");
  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

// Function to write to the certificates file
const writeCertificates = (certificates) => {
  fs.writeFileSync(
    certificatesFilePath,
    JSON.stringify(certificates, null, 2),
    "utf-8"
  );
};

// Controller to verify and store a certificate
const certificateVerification = (req, res) => {
  const { crNumber, userInfo } = req.body;

  console.log("crNumber: " + crNumber);
  console.log(JSON.stringify(req.body, null, 2));
  if (!crNumber || !userInfo) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  let certificates = readCertificates();

  if (certificates == null) {
    certificates = {};
  }
  // Check if certificate already exists
  if (certificates[crNumber]) {
    return res.status(200).json({
      message: "Certificate already exists",
      certificate: certificates[crNumber],
    });
  }

  // Store the new certificate
  certificates[crNumber] = userInfo;
  writeCertificates(certificates);

  return res.status(201).json({
    message: "Certificate stored successfully",
    status: true,
    certificate: userInfo,
  });
};

// Controller to check if a certificate exists
const checkCertificateExists = (req, res) => {
  console.log(req.body);
  const { crNumber } = req.body;

  console.log("............");
  if (!crNumber) {
    return res.status(400).json({ error: "Certificate number is required" });
  }

  const certificates = readCertificates();

  if (certificates[crNumber]) {
    return res
      .status(200)
      .json({ exists: true, certificate: certificates[crNumber] });
  }

  return res
    .status(404)
    .json({ exists: false, message: "Certificate not found" });
};

// Other user methods...

module.exports = {
  certificateVerification,
  checkCertificateExists,
  getAllCertificates,
};
