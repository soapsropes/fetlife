'use strict';

const FetLife = require('./index');
const { username, password } = require('./credentials');

const doIt = async () => {
	const fetlife = new FetLife();
	console.log('logging in');
	await fetlife.login(username, password);
	console.log('token:');
	console.log(fetlife.getAccessToken());
	console.log('getting me');
	const me = await fetlife.getMe();
	console.log(JSON.stringify(me, null, 2));
};

doIt().catch((error) => {
	console.error(`Failed: ${error}`);
	console.error(error.stack);
});

