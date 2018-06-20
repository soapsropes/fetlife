'use strict';

const _ = require('lodash');
const oauth2 = require('simple-oauth2');
const Wreck = require('wreck');

const clientId = 'd8f8ebd522bf5123c3f29db3c8faf09029a032b44f0d1739d4325cd3ccf11570';
const clientSecret = '47273306a9a3a3448a908748eff13a21a477cc46f6a3968b5c7d05611c4f2f26';

const userAgent = 'okhttp/3.10.0';

const baseUri = 'https://app.fetlife.com';
const headers = { 'User-Agent': userAgent };

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
		headers,
	},
	options: {
		authorizationMethod: 'body',
	},
};

const oauthClient = oauth2.create(oauthConfig);

class FetLife {
	constructor(options) {
		this.accessToken = null;

		this.wreck = Wreck.defaults({
			baseUrl: `${baseUri}/api/v2`,
			headers,
		});

		if (_.has(options, 'accessToken')) {
			this.setAccessToken(options.accessToken);
		}

		this.onTokenRefresh = _.get(options, 'onTokenRefresh', null);
	}

	setAccessToken(tokenData) {
		this.accessToken = oauthClient.accessToken.create(tokenData);

		const authHeaders = _.assign(
			{},
			headers,
			{ Authorization: `Bearer ${this.accessToken.token.access_token}` }
		);

		this.wreck = this.wreck.defaults({ headers: authHeaders });
	}

	getAccessToken() {
		return this.accessToken.token;
	}

	async login(username, password) {
		const tokenConfig = { username, password };
		const tokenData = await oauthClient.ownerPassword.getToken(tokenConfig);
		this.setAccessToken(tokenData);
	}

	async apiRequest(resource, method) {
		if (!this.accessToken) {
			throw new Error('No access token available');
		}

		const res = await this.wreck.request(method || 'GET', resource);
		const body = await Wreck.read(res);

		return JSON.parse(body.toString());
	}

	async getMe() {
		return this.apiRequest('me');
	}
}

module.exports = FetLife;

