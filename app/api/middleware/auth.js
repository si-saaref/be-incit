const chalk = require('chalk');
const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

module.exports = {
	isLoginUser: async (req, res, next) => {
		try {
			const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
			// console.log('TOKEN CHECK => ', token);
			const userPayload = jwt.verify(token, 'secret');
			const { id, ...args } = userPayload.user;
			// console.log(chalk.bgRed('USER TOKEN CHECK => ', JSON.stringify(userPayload, null, 2)));

			if (!userPayload) {
				throw new Error();
			} else {
				const checkUser = await User.findOne({
					where: { id },
				});
				// console.log(chalk.bgBlue('CHECK USER DB =>', JSON.stringify(checkUser, null, 2)));
				if (!checkUser) {
					res.status(403).json({ message: 'Astaughfirullah anda siapa?', status: 403 });
				} else {
					req.user = { ...args, userId: id };
					next();
				}
			}
		} catch (error) {
			res.status(403).json({ message: 'You have to login first', status: 403 });
		}
	},
};
