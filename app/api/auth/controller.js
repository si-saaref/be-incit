const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passwordChecker, emailChecker } = require('../../helper/helper');

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

					if (!userPayload) {
						res
							.status(400)
							.json({ message: 'Cannot create users due to server failure', status: 400 });
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
				const checkPassword = bcrypt.compareSync(password, userPayload.password);
				if (!checkPassword) {
					res.status(400).json({ message: "Email and Password didn't match", status: 400 });
					return;
				}
			}
			await User.update(
				{ isActive: true },
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
			const { email } = req.body;
			const userPayload = await User.findOne({
				where: {
					email: email,
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
					totalLogin: (userPayload.totalLogin += 1),
				},
				{
					where: {
						email: email,
					},
				}
			);

			res.status(200).json({ message: 'Sign out successfully', status: 200 });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	editUser: async (req, res) => {
		try {
			const { name } = req.body;
			const { userId } = req.user;
			const userPayload = await User.findOne({
				where: { id: userId },
			});
			if (!userPayload) {
				res.status(404).json({ message: "User does't exist. Please register first", status: 404 });
				return;
			}
			await User.update(
				{
					name,
				},
				{
					where: { id: userId },
				}
			);

			res.status(200).json({ message: 'Edit profile successfully', status: 200 });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	editPassword: async (req, res) => {
		try {
			const { oldPassword, newPassword } = req.body;
			const { userId } = req.user;
			const userPayload = await User.findOne({
				where: { id: userId },
			});
			if (!userPayload) {
				res.status(404).json({ message: "User does't exist. Please register first", status: 404 });
				return;
			}
			const checkPassword = bcrypt.compareSync(oldPassword, userPayload.password);
			if (!checkPassword) {
				res
					.status(400)
					.json({ message: 'Old password is incorrect. Please try again', status: 400 });
				return;
			}
			const updatedUser = await User.update(
				{
					password: newPassword,
				},
				{
					where: { id: userId },
				}
			);
			delete updatedUser.dataValues.password;

			res
				.status(200)
				.json({ message: 'Successfully update password', status: 200, data: updatedUser });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
};
