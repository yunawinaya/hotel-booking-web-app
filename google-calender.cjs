const { google } = require("googleapis");
require("dotenv").config();

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = "https://www.googleapis.com/auth/calendar";
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
  CREDENTIALS.client_email,
  null,
  CREDENTIALS.private_key,
  SCOPES
);

const insertEvent = async (event) => {
  try {
    let response = await calendar.events.insert({
      auth,
      calendarId: calendarId,
      resource: event,
    });

    if (response.status === 200 && response.statusText === "OK") {
      return 1;
    } else {
      console.log("Failed to insert event:", response.data);
      return 0;
    }
  } catch (error) {
    console.log("Error at insertEvent:", error.message);
    return 0;
  }
};

module.exports = {
  insertEvent,
};
