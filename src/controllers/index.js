const { login, register } = require("./auth.controller");
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  eventRegister,
} = require("./event.controller");

module.exports = {
  login,
  register,
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  eventRegister,
};
