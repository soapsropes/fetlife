'use strict';

const _ = require('lodash');
const oauth2 = require('simple-oauth2');
const request = require('request-promise');

const baseUri = 'https://app.fetlife.com';
const userAgent = 'okhttp/3.10.0';

const clientId = 'd8f8ebd522bf5123c3f29db3c8faf09029a032b44f0d1739d4325cd3ccf11570';
const clientSecret = '47273306a9a3a3448a908748eff13a21a477cc46f6a3968b5c7d05611c4f2f26';

const oauthConfig = {
	client: {
		id: clientId,
		secret: clientSecret,
	},
	auth: {
		tokenHost: baseUri,
		tokenPath: 'api/oauth/token',
	},
	http: {
		headers: {
			'User-Agent': userAgent,
		},
	},
	options: {
		authorizationMethod: 'body',
	},
};

const client = oauth2.create(oauthConfig);

class FetLife {
	constructor(options) {
		if (_.has(options, 'accessToken')) {
			this.accessToken = client.accessToken.create(options.accessToken);
		} else {
			this.accessToken = null;
		}

		this.onTokenRefresh = _.get(options, 'onTokenRefresh', null);
	}

	async login(username, password) {
		const tokenConfig = { username, password };
		const tokenData = await client.ownerPassword.getToken(tokenConfig);
		this.accessToken = client.accessToken.create(tokenData);
	}

	async apiRequest(resource, method) {
		if (!this.accessToken) {
			throw new Error('No access token available');
		}

		const options = {
			url: `${baseUri}/api/v2/${resource}`,
			headers: {
				'User-Agent': userAgent,
			},
			auth: {
				bearer: this.accessToken.token.access_token,
			},
		};

		return request[method || 'get'](options)
			.then(response => JSON.parse(response));
	}

	async getMe() {
		return this.apiRequest('me');
	}
}

module.exports = FetLife;

