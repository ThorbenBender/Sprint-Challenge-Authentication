const axios = require('axios');
const knex = require('knex');
const bcrypt = require('bcryptjs');

const knexConfig = require('../knexfile').development;

const db = knex(knexConfig);

const { authenticate } = require('../auth/authenticate');
const createToken = require('./token');

module.exports = (server) => {
	server.post('/api/register', register);
	server.post('/api/login', login);
	server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
	// implement user registration
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 10);

	credentials.password = hash;

	db('users')
		.insert(credentials)
		.then((user) => {
			res.status(200).json(user);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}

function login(req, res) {
	// implement user login
	db('users')
		.where({ username: req.body.username })
		.first()
		.then((user) => {
			if (req.body && bcrypt.compareSync(req.body.password, user.password)) {
				const token = createToken(user);
				res.status(200).json({
					message: 'You are logged in',
					token: token
				});
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
}

function getJokes(req, res) {
	const requestOptions = {
		headers: { accept: 'application/json' }
	};

	axios
		.get('https://icanhazdadjoke.com/search', requestOptions)
		.then((response) => {
			res.status(200).json(response.data.results);
		})
		.catch((err) => {
			res.status(500).json({ message: 'Error Fetching Jokes', error: err });
		});
}
