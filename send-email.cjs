const nodemailer = require("nodemailer");

async function sendEmail(receiver, subject, text) {
  // Create a transporter using the SMTP settings of your email service
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Replace with your email service
    auth: {
      user: "gedeyuna@gmail.com", // Replace with your email address
      pass: process.env.EMAIL_PASS, // Replace with your email password
    },
  });

  // Create an email message
  const mailOptions = {
    from: "gedeyuna@gmail.com", // Replace with your email address
    to: receiver, // Receiver's email address
    subject: subject, // Email subject
    text: text, // Plain text version of the email
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending the email:", error);
  }
}

module.exports = {
  sendEmail,
};
