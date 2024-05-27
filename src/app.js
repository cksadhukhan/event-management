const express = require("express");

const { authRoute, eventRoute } = require("./routes");

const app = express();
app.use(express.json());

app.use("/api/v1/auth/", authRoute);
app.use("/api/v1/events/", eventRoute);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
