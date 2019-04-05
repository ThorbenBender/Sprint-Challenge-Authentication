const jwt = require('jsonwebtoken');
const createToken = (user) => {
	const payload = {
		subject: user.id,
		username: user.username
	};
	const options = {
		expiresIn: '1h'
	};
	const token = jwt.sign(payload, 'secret', options);
	return token;
};

module.exports = createToken;
