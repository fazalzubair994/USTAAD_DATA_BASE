const express = require("express");
const { deleteInterfaceById, addInterface,getAllInterfaces,getInterfacebyId} = require("../controllers/userInterfaceController");

const router = express.Router();

router.get("/getAll", getAllInterfaces);
router.post("/add", addInterface);
router.delete("/:id", deleteInterfaceById);
router.get("/:id", getInterfacebyId);
// Other user routes...

module.exports = router;
