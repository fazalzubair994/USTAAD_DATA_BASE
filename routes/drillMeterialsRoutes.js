const express = require("express");
const { deleteDrillMeterialbyID, addNewDrill,getAllDrills,getDrillMeterialById} = require("../controllers/drillMeterialsController");

const router = express.Router();

router.get("/getAll", getAllDrills);
router.post("/add", addNewDrill);
router.delete("/:id", deleteDrillMeterialbyID);
router.get("/:id", getDrillMeterialById);
// Other user routes...

module.exports = router;