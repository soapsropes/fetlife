'use strict';

const FetLife = require('../dist');
const { username, password } = require('./credentials');

const doIt = async () => {
	console.log('Creating new FetLife client');
	const fetlife = new FetLife();

	console.log('Logging in');
	await fetlife.login(username, password);

	console.log('Getting friend requests');
	const friendRequests = await fetlife.getFriendRequests();
	console.log(`Received ${friendRequests.length} friend request(s)`);

	await Promise.all(friendRequests.map((friendRequest) => {
		console.log(`Accepting friend request ${friendRequest.id} from ${friendRequest.member.nickname}`);
		return fetlife.acceptFriendRequest(friendRequest.id)
			.then((resp) => {
				console.log(`Accepted friend request from ${resp.member.nickname}`);
			})
			.catch((error) => {
				console.error(`Failed to accept friend request ${friendRequest.id}: ${error}`);
			});
	}));

	console.log('Getting token');
	const token = await fetlife.getAccessToken();
	console.log(`Token: ${JSON.stringify(token, null, 2)}`);

	console.log('Creating new FetLife client from token');
	const fetlife2 = new FetLife({ accessToken: token });

	console.log('Getting me');
	const me = await fetlife2.getMe();
	console.log(JSON.stringify(me, null, 2));
};

doIt().catch((error) => {
	console.error(`Failed: ${error}`);
	console.error(error.stack);
});
