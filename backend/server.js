const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

// Initialize Express
const app = express();
app.use(bodyParser.json());

// Email transporter configuration for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using Gmail service for sending emails
  auth: {
    user: 'your-email@example.com', // Replace with your Gmail address
    pass: 'your-email-password',    // Replace with your Gmail password or app password
  }
});

// POST route to schedule an email
app.post('/api/schedule-email', async (req, res) => {
  const { to, subject, body, time } = req.body;

  if (!to || !subject || !body || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Convert the time string to a Date object (assuming `time` is a future date string)
    const scheduleTime = new Date(time);

    // Validate that the time is a future time
    if (scheduleTime <= Date.now()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    // Schedule the email to be sent at the specified time using setTimeout
    const delay = scheduleTime - Date.now();
    setTimeout(async () => {
      try {
        // Send the email
        await transporter.sendMail({
          from: 'your-email@example.com',
          to,
          subject,
          text: body,
        });

        console.log(`Email sent to ${to} with subject: ${subject}`);
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }, delay);

    res.status(200).json({
      message: `Email scheduled successfully to ${to} at ${time}`,
    });
  } catch (error) {
    console.error('Error scheduling email:', error);
    res.status(500).json({ error: 'Failed to schedule email' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
