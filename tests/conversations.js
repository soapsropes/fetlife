'use strict';

const _ = require('lodash');
const FetLife = require('../dist/index');
const { username, password } = require('./credentials');

const doIt = async () => {
	console.log('Creating new FetLife client');
	const fetlife = new FetLife();

	console.log('Logging in');
	await fetlife.login(username, password);

	console.log('Getting me');
	const me = await fetlife.getMe();

	console.log('Getting conversations');
	const conversations = await fetlife.getConversations();

	console.log(`Received ${conversations.length} conversation(s)`);
	// console.log(JSON.stringify(conversations, null, 2));

	conversations.forEach(async (conversation) => {
		if (!conversation.has_new_messages) {
			return;
		}
		const member = await fetlife.getMember(conversation.member.id);
		if (member.relation_with_me === 'friend' || member.relation_with_me === 'following') {
			// return;
		}
		if (member.gender.name !== 'Male') {
			// return;
		}
		const messages = await fetlife.getConversationMessages(conversation.id);
		const anyFromMe = _.find(messages, m => m.member.id === me.id);
		if (anyFromMe) {
			return;
		}
		console.log(`Mark conversation id ${conversation.id} read: "${conversation.subject}" from ${conversation.member.nickname} with ${conversation.message_count} message(s)`);
		await fetlife.markConversationMessagesRead(
			conversation.id,
			messages.filter(message => message.is_new)
				.map(message => message.id),
		);
	});
};

doIt().catch((error) => {
	console.error(`Failed: ${error}`);
	console.error(error.stack);
});
