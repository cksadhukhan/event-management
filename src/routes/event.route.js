const express = require("express");
const {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  eventRegister,
} = require("../controllers");
const { verifyToken } = require("../middlewares");

const router = express.Router();

router.get("/", verifyToken, getEvents);

router.get("/:id", verifyToken, getEvent);

router.post("/", verifyToken, createEvent);

router.put("/:id", verifyToken, updateEvent);

router.delete("/:id", verifyToken, deleteEvent);

router.post("/:id/register", verifyToken, eventRegister);

module.exports = router;
