require('dotenv').config();

//importing modules
const nodemailer = require('nodemailer');

module.exports.sendingMail = async ({ from, to, subject, html }) => {
	try {
		let mailOptions = {
			from,
			to,
			subject,
			html,
		};

		const Transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			service: 'gmail',
			auth: {
				user: process.env.email,
				pass: process.env.emailpassword,
			},
		});

		return await Transporter.sendMail(mailOptions);
	} catch (error) {
		console.log(error);
	}
};
