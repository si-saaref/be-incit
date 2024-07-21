const jwt = require('jsonwebtoken');
const { User } = require('../../db/models');

module.exports = {
	isLoginUser: async (req, res, next) => {
		try {
			const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
			const userPayload = jwt.verify(token, 'secret');
			const { id, ...args } = userPayload.user;

			if (!userPayload) {
				throw new Error();
			} else {
				const checkUser = await User.findOne({
					where: { id },
				});
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
