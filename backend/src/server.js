const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
	port: parseInt(process.env.EMAIL_PORT || '465'),
	secure: process.env.EMAIL_SECURE === 'true',
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
	debug: true, // Enable debug output
	connectionTimeout: 10000, // 10 seconds
	greetingTimeout: 10000, // 10 seconds
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
	try {
		const { to, subject, text, html } = req.body;

		const mailOptions = {
			from: process.env.EMAIL_FROM,
			to,
			subject,
			text,
			html,
		};

		await transporter.sendMail(mailOptions);
		res.status(200).json({ message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ error: 'Failed to send email' });
	}
});
app.get('/', (req, res) => {
	res.send('Hello World');
});
// Start server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

