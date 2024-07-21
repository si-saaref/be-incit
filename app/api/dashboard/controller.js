const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passwordChecker, emailChecker } = require('../../helper/helper');

module.exports = {
	listUser: async (req, res) => {
		try {
			const totalSignedUpUser = await User.findAll({
				attributes: ['id', 'name', 'totalLogin', 'createdAt', 'logoutAt'],
			});

			res
				.status(201)
				.json({ message: 'User account has been created', status: 201, data: totalSignedUpUser });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
	// signIn: async (req, res) => {
	// 	try {
	// 		const { email, password } = req.body;
	// 		const userPayload = await User.findOne({
	// 			where: {
	// 				email: email,
	// 			},
	// 		});
	// 		if (!userPayload) {
	// 			res.status(404).json({ message: "User does't exist. Please register first", status: 404 });
	// 			return;
	// 		} else {
	// 			const checkPassword = bcrypt.compareSync(password, userPayload.password);
	// 			if (!checkPassword) {
	// 				res.status(400).json({ message: "Email and Password didn't match", status: 400 });
	// 				return;
	// 			}
	// 		}
	// 		await User.update(
	// 			{ isActive: true, totalLogin: (userPayload.totalLogin += 1) },
	// 			{
	// 				where: {
	// 					email: email,
	// 				},
	// 			}
	// 		);
	// 		const token = jwt.sign(
	// 			{
	// 				user: {
	// 					id: userPayload.id,
	// 					email: userPayload.email,
	// 					name: userPayload.name,
	// 				},
	// 			},
	// 			'secret',
	// 			{
	// 				expiresIn: '24h',
	// 			}
	// 		);

	// 		const dataPayload = {
	// 			token,
	// 		};
	// 		res.status(200).json({ message: 'Login successfully', status: 200, data: dataPayload });
	// 	} catch (error) {
	// 		res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
	// 	}
	// },
};
