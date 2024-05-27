const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const moment = require("moment");

const prisma = new PrismaClient();

exports.getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: { organizer: true, participants: true },
    });

    return res.json({
      message: "Events retrived successfully",
      data: events,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: { organizer: true, participants: true },
    });

    if (!event) {
      return res.json({
        message: `Event with envent id ${id} not found`,
      });
    }

    delete event.organizer.password;

    event.participants.forEach((participant) => {
      delete participant.password;
    });

    return res.json({
      message: "Event retrived successfully",
      data: event,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  const { title, description, date, time, participantIds } = req.body;

  const defaultDate = moment().format("DD-MM-YYYY");
  const defaultTime = moment().format("HH:mm:ss");

  const formattedDate = date
    ? moment(date, "DD-MM-YYYY").format("DD-MM-YYYY")
    : defaultDate;
  const formattedTime = time
    ? moment(time, "HH:mm:ss").format("HH:mm:ss")
    : defaultTime;

  try {
    if (!title || !description) {
      return res.json({
        message: "Please provide title and description",
      });
    }

    const event = await prisma.event.create({
      data: {
        id: uuidv4(),
        title,
        description,
        date: formattedDate,
        time: formattedTime,
        organizer: { connect: { id: req.userId } },
        participants: { connect: participantIds?.map((id) => ({ id })) },
      },
    });

    return res.json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time, participantIds } = req.body;

  const formattedDate = moment(date, "DD-MM-YYYY").format("DD-MM-YYYY");
  const formattedTime = moment(time, "HH:mm:ss").format("HH:mm:ss");

  try {
    const eventExist = await prisma.event.findUnique({
      where: { id },
      include: { organizer: true, participants: true },
    });

    if (!eventExist) {
      return res.json({
        message: `Event with envent id ${id} not found`,
      });
    }

    if (eventExist.organizerId !== req.userId)
      return res.json({
        message: "You are not authorized to update this event",
      });

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: formattedDate,
        time: formattedTime,
        participants: {
          set: participantIds?.map((id) => ({ id })) || [],
        },
      },
    });

    return res.json({
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({
      message: "Failed to update event",
      error: error.message,
    });
  }
};

exports.eventRegister = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const eventExist = await prisma.event.findUnique({
      where: { id },
      include: { organizer: true, participants: true },
    });

    if (!eventExist) {
      return res.json({
        message: `Event with envent id ${id} not found`,
      });
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        participants: {
          connect: { id: userId },
        },
      },
      include: { organizer: true, participants: true },
    });

    return res.json({
      message: `Successfully registered for the event ${eventExist.title}`,
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const eventExist = await prisma.event.findUnique({
      where: { id },
      include: { organizer: true, participants: true },
    });

    if (!eventExist) {
      return res.json({
        message: `Event with envent id ${id} not found`,
      });
    }

    await prisma.event.delete({
      where: { id },
    });

    return res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("Something went wrong ", error);
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
