const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const { passwordChecker } = require('../../helper/helper');
require('dotenv').config();

module.exports = {
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
			try {
				const checkPassword = bcrypt.compareSync(oldPassword, userPayload.password);
				if (!checkPassword) {
					res
						.status(400)
						.json({ message: 'Old password is incorrect. Please try again', status: 400 });
					return;
				}
				if (passwordChecker(newPassword)) {
					await User.update(
						{
							password: bcrypt.hashSync(newPassword, 10),
						},
						{
							where: { id: userId },
						}
					);

					res.status(200).json({ message: 'Successfully update password', status: 200 });
				}
			} catch (error) {
				res.status(400).json({ message: error.message, status: 400 });
			}
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	getDetailUser: async (req, res) => {
		try {
			const { userId } = req.user;
			const userPayload = await User.findOne({
				where: { id: userId },
			});
			if (!userPayload) {
				res.status(404).json({ message: "User does't exist", status: 404 });
				return;
			}
			res
				.status(200)
				.json({ message: 'Successfully get detail user', status: 200, data: userPayload });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
};
