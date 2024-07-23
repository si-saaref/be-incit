const { User, Token } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passwordChecker, emailChecker } = require('../../helper/helper');
const crypto = require('crypto');
const { sendingMail } = require('../../helper/mailing');
require('dotenv').config();

module.exports = {
	signUp: async (req, res) => {
		try {
			const { email, password } = req.body;
			try {
				emailChecker(email?.trim());
				passwordChecker(password?.trim());
			} catch (error) {
				res.status(406).json({ message: error.message, status: 406 });
				return;
			}

			const isExistingUser = await User.findOne({ where: { email } });
			if (isExistingUser) {
				res
					.status(409)
					.json({ message: 'User already exist. Please use another email', status: 409 });
				return;
			}

			try {
				if (passwordChecker(password)) {
					const userPayload = await User.create({
						email,
						password: bcrypt.hashSync(password, 10),
						name: '',
						isValidate: false,
						isActive: false,
						totalLogin: 0,
					});

					const token = await Token.create({
						userId: userPayload.id,
						token: crypto.randomBytes(16).toString('hex'),
					});

					if (token) {
						await sendingMail({
							from: 'no-reply@incit-dashboard.com',
							to: `${email}`,
							subject: 'Account Verification Link',
							// text: `Hello, Please verify your email by clicking this link :
							//   http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${userPayload.id}/${token.token} `,
							html: `
              <div>
                <p>Hello, Please verify your email by clicking this link :</p>
                <a  href=http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${userPayload.id}/${token.token} style=" border: 1px solid lightgray; padding: 5px 10px; border-radius: 8px; background: #1bacb0; color: white; text-decoration: none;">Verify Your Account</a>
              </div>
              `,
						});
					} else {
						res.status(400).json({
							message: 'Cannot send verification link',
							status: 400,
						});
					}

					if (!userPayload) {
						res
							.status(500)
							.json({ message: 'Cannot create users due to server failure', status: 500 });
					}

					delete userPayload.dataValues.password;
					res
						.status(201)
						.json({ message: 'User account has been created', status: 201, data: userPayload });
				}
			} catch (error) {
				res.status(400).json({ message: error.message, status: 400 });
			}
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	verifyEmail: async (req, res) => {
		try {
			const token = req.params.token;

			const usertoken = await Token.findOne({
				token,
				where: {
					userId: req.params.id,
				},
			});

			if (!usertoken) {
				return res.status(400).json({
					message:
						'Your verification link may have expired. Please click on resend for verify your Email.',
					status: 400,
				});
			} else {
				const user = await User.findOne({ where: { id: req.params.id } });
				if (!user) {
					return res.status(401).json({
						message: 'We were unable to find a user for this verification. Please SignUp!',
						status: 401,
					});
				} else if (user.isValidate) {
					return res.status(200).json({ message: 'User has been already verified. Please Login' });
				} else {
					const updated = await User.update(
						{ isValidate: true },
						{
							where: {
								id: usertoken.userId,
							},
						}
					);

					//if not updated send error message
					if (!updated) {
						return res.status(500).json({ message: err.message, status: 500 });
						//else send status of 200
					} else {
						setTimeout(() => {
							res.redirect('http://127.0.0.1:5173');
						}, 1000);
						return res
							.status(200)
							.send(
								'Your account has been successfully verified\n Please login to dive into the dashboard'
							);
					}
				}
			}
		} catch (error) {}
	},
	signIn: async (req, res) => {
		try {
			const { email, password } = req.body;
			const userPayload = await User.findOne({
				where: {
					email: email,
				},
			});
			if (!userPayload) {
				res.status(404).json({ message: "User does't exist. Please register first", status: 404 });
				return;
			} else {
				if (!userPayload.isValidate) {
					res.status(403).json({
						message: 'Your email have not be verified yet. Please check your email',
						status: 403,
					});
					return;
				}
				const checkPassword = bcrypt.compareSync(password, userPayload.password);
				if (!checkPassword) {
					res.status(400).json({ message: "Email and Password didn't match", status: 400 });
					return;
				}
			}
			await User.update(
				{ isActive: true, totalLogin: (userPayload.totalLogin += 1) },
				{
					where: {
						email: email,
					},
				}
			);
			const token = jwt.sign(
				{
					user: {
						id: userPayload.id,
						email: userPayload.email,
						name: userPayload.name,
					},
				},
				'secret',
				{
					expiresIn: '24h',
				}
			);

			const dataPayload = {
				token,
			};
			res.status(200).json({ message: 'Login successfully', status: 200, data: dataPayload });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	signOut: async (req, res) => {
		try {
			const { userId } = req.user;
			const userPayload = await User.findOne({
				where: {
					id: userId,
				},
			});
			if (!userPayload) {
				res.status(404).json({ message: "User does't exist. Please register first", status: 404 });
				return;
			}
			await User.update(
				{
					isActive: false,
					logoutAt: new Date().toISOString(),
				},
				{
					where: {
						id: userId,
					},
				}
			);

			res.status(200).json({ message: 'Sign out successfully', status: 200 });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	resendEmailVerification: async (req, res) => {
		try {
			const { email } = req.params;
			const userPayload = await User.findOne({
				where: {
					email: email,
				},
			});
			if (!userPayload) {
				res.status(404).json({ message: 'User not found. Please check your email', status: 404 });
				return;
			}
			const token = await Token.findOne({
				where: {
					userId: userPayload.id,
				},
			});

			if (token) {
				await sendingMail({
					from: 'no-reply@incit-dashboard.com',
					to: `${email}`,
					subject: 'Account Verification Link',
					html: `
              <div>
                <p>Hello, Please verify your email by clicking this link :</p>
                <a  href=http://localhost:${process.env.PORT}/api/v1/auth/verify-email/${userPayload.id}/${token.token} style=" border: 1px solid lightgray; padding: 5px 10px; border-radius: 8px; background: #1bacb0; color: white; text-decoration: none;">Verify Your Account</a>
              </div>
              `,
				});
				res.status(200).json({ message: 'Successfully resend email verification', status: 200 });
			} else {
				res.status(400).json({
					message: 'Cannot send verification link',
					status: 400,
				});
			}
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	signInOauth: async (req, res) => {
		try {
			const { email, name } = req.body;
			const userPayload = await User.findOne({
				where: {
					email: email,
				},
			});
			if (!userPayload) {
				await User.create({
					email,
					name,
					isValidate: true,
					isActive: true,
					totalLogin: 0,
				});
			}
			const userData = await User.findOne({
				where: {
					email: email,
				},
			});
			await User.update(
				{ isActive: true, totalLogin: (userData.totalLogin += 1) },
				{
					where: {
						email: email,
					},
				}
			);
			const token = jwt.sign(
				{
					user: {
						id: userData.id,
						email: userData.email,
						name: userData.name,
					},
				},
				'secret',
				{
					expiresIn: '24h',
				}
			);

			const dataPayload = {
				token,
			};
			res.status(200).json({ message: 'Login successfully', status: 200, data: dataPayload });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
};
