const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/authMiddleware");
const {create,getAll,getSpecific,update,remove} = require("../controllers/taskController");

router.post("/", verifyToken, create);
router.get("/:id", verifyToken, getSpecific);
router.get("/", verifyToken, getAll);
router.put("/:id", verifyToken, update);
router.delete("/:id", verifyToken, remove);

module.exports = router;