'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			models.User.hasOne(models.Token, {
				as: 'token',
				foreignKey: 'userId',
			});
		}
	}
	User.init(
		{
			name: DataTypes.STRING,
			email: DataTypes.STRING,
			password: DataTypes.STRING,
			isActive: DataTypes.BOOLEAN,
			totalLogin: DataTypes.INTEGER,
			logoutAt: DataTypes.DATE,
			isValidate: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			modelName: 'User',
		}
	);
	return User;
};
