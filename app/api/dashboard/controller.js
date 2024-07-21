const { User } = require('../../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passwordChecker, emailChecker } = require('../../helper/helper');
const { Op } = require('sequelize');

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
	summary: async (req, res) => {
		try {
			let dateNow = new Date();
			dateNow.setUTCHours(0, 0, 0, 0);
			const todayISOdate = dateNow.toISOString();

			let dateLastWeek = new Date(new Date().getTime() - 24 * 7 * 60 * 60 * 1000);
			dateLastWeek.setUTCHours(0, 0, 0, 0);
			const lastWeekIsoDate = dateLastWeek.toISOString();

			const totalSignedUpUser = await User.count();
			const totalActiveUsersToday = await User.count({
				where: {
					[Op.or]: [
						{
							isActive: true,
						},
						{
							logoutAt: {
								[Op.gt]: todayISOdate,
							},
						},
					],
				},
			});

			const averageActiveUserWeekly =
				(await User.count({
					where: {
						[Op.or]: [
							{
								isActive: true,
							},
							{
								logoutAt: {
									[Op.gt]: lastWeekIsoDate,
								},
							},
						],
					},
				})) / 7;

			const data = {
				totalSignedUpUser,
				totalActiveUsersToday,
				averageActiveUserWeekly,
			};

			res
				.status(200)
				.json({ message: 'Successfully get dashboard summary', status: 200, data: data });
		} catch (error) {
			res.status(500).json({ message: error.message || 'Internal Message Error', status: 500 });
		}
	},
};
