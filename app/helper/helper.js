const { User } = require('../db/models');

const passwordChecker = (password) => {
	if (password.length < 8) {
		throw new Error('Password is invalid. Password should contain at least 8 characters');
	}

	if (!/[a-z]/g.test(password)) {
		throw new Error('Password is invalid. Password should contain lowercase letter');
	}

	if (!/[A-Z]/g.test(password)) {
		throw new Error('Password is invalid. Password should contain capitalcase letter');
	}

	if (!/[0-9]/g.test(password)) {
		throw new Error('Password is invalid. Password should contain numbers');
	}

	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/g.test(password)) {
		throw new Error('Password is invalid. Password should contain special characters');
	}

	return true;
};

const emailChecker = (email) => {
	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g.test(email)) {
		throw new Error('Email is invalid. Plase check again your email');
	}
	return true;
};

module.exports = {
	passwordChecker,
	emailChecker,
};
