'use strict';

const FetLife = require('../index');
const token = require('./token');

const onTokenRefresh = (newToken) => {
	console.log(`Received new token: ${JSON.stringify(newToken, null, 2)}`);
};

const doIt = async () => {
	console.log('Creating new FetLife client from token');
	const fetlife = new FetLife({
		onTokenRefresh,
		accessToken: token,
	});

	console.log('Getting me');
	const me = await fetlife.getMe();
	console.log(`I am ${me.nickname}`);
};

doIt().catch((error) => {
	console.error(`Failed: ${error}`);
	console.error(error.stack);
});
