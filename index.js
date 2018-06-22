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
	updateWreckHeaders() {
		const authHeaders = _.assign(
			{},
			headers,
			{ Authorization: `Bearer ${this.accessToken.token.access_token}` },
		);

		this.wreck = this.wreck.defaults({ headers: authHeaders });
	}

	setAccessToken(tokenData) {
		this.accessToken = oauthClient.accessToken.create(tokenData);
		this.updateWreckHeaders();
	}

	async assertAccessToken() {
		if (!this.accessToken) {
			throw new Error('No access token available - login or provide token');
		}

		const { token } = this.accessToken;

		const expiresAt = token.expires_at.getTime();
		const now = new Date().getTime();

		if (Number.isNaN(expiresAt) || (now + 300000 > expiresAt)) {
			// token has expired or will expire within the next 5 minutes
			this.accessToken = await this.accessToken.refresh();
			this.updateWreckHeaders();
			if (this.onTokenRefresh) {
				await this.onTokenRefresh(_.cloneDeep(this.accessToken.token));
			}
		}
	}

	async getAccessToken() {
		await this.assertAccessToken();
		return this.accessToken.token;
	}

	async login(username, password) {
		const tokenConfig = { username, password };
		const tokenData = await oauthClient.ownerPassword.getToken(tokenConfig);
		this.setAccessToken(tokenData);
	}

	async apiRequest(resource, method) {
		await this.assertAccessToken();
		const { payload } = await this.wreck[method || 'get'](
			resource,
			{ json: 'strict' },
		);
		return payload;
	}

	async getMe() {
		return this.apiRequest('me');
	}

	async getFriendRequests() {
		return this.apiRequest('me/friendrequests');
	}

	async getFriendRequestsSent() {
		return this.apiRequest('me/friendrequests?filter=sent');
	}

	async acceptFriendRequest(friendRequestId) {
		return this.apiRequest(`me/friendrequests/${friendRequestId}`, 'put');
	}

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
}

module.exports = FetLife;
