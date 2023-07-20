const express = require("express");
const { insertEvent } = require("./google-calender.cjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/sync-booking", async (req, res) => {
  try {
    // Get the event details from the request body
    const event = req.body;

    const result = await insertEvent(event);

    if (result === 1) {
      // Event insertion successful
      res.status(200).json({ message: "Event added to Google Calendar" });
    } else {
      // Event insertion failed
      res.status(500).json({ error: "Failed to add event to Google Calendar" });
    }
  } catch (error) {
    console.log(`Error at /api/sync-booking: ${error}`);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the hotel API!" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
