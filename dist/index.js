'use strict';

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

require('@babel/polyfill');

var _ = require('lodash');

var oauth2 = require('simple-oauth2');

var Axios = require('axios');

var clientId = 'd8f8ebd522bf5123c3f29db3c8faf09029a032b44f0d1739d4325cd3ccf11570';
var clientSecret = '47273306a9a3a3448a908748eff13a21a477cc46f6a3968b5c7d05611c4f2f26';
var userAgent = 'okhttp/3.10.0';
var baseUri = 'https://app.fetlife.com';
var headers = {
  'User-Agent': userAgent
};
var oauthConfig = {
  client: {
    id: clientId,
    secret: clientSecret
  },
  auth: {
    tokenHost: baseUri,
    tokenPath: 'api/oauth/token'
  },
  http: {
    headers: _objectSpread({}, headers)
  }
};
var oauthClient = oauth2.create(oauthConfig);

var FetLife =
/*#__PURE__*/
function () {
  _createClass(FetLife, [{
    key: "updateAxiosHeaders",
    value: function updateAxiosHeaders() {
      var authHeaders = _.assign({}, headers, {
        Authorization: "Bearer ".concat(this.accessToken.token.access_token)
      });

      this.axios.defaults.headers.common = authHeaders;
    }
  }, {
    key: "setAccessToken",
    value: function setAccessToken(tokenData) {
      this.accessToken = oauthClient.accessToken.create(tokenData);
      this.updateAxiosHeaders();
    }
  }, {
    key: "assertAccessToken",
    value: function () {
      var _assertAccessToken = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var token, expiresAt, now;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.accessToken) {
                  _context.next = 2;
                  break;
                }

                throw new Error('No access token available - login or provide token');

              case 2:
                token = this.accessToken.token;
                expiresAt = token.expires_at.getTime();
                now = new Date().getTime();

                if (!(Number.isNaN(expiresAt) || now + 300000 > expiresAt)) {
                  _context.next = 13;
                  break;
                }

                _context.next = 8;
                return this.accessToken.refresh();

              case 8:
                this.accessToken = _context.sent;
                this.updateAxiosHeaders();

                if (!this.onTokenRefresh) {
                  _context.next = 13;
                  break;
                }

                _context.next = 13;
                return this.onTokenRefresh(_.cloneDeep(this.accessToken.token));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function assertAccessToken() {
        return _assertAccessToken.apply(this, arguments);
      };
    }()
  }, {
    key: "getAccessToken",
    value: function () {
      var _getAccessToken = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.assertAccessToken();

              case 2:
                return _context2.abrupt("return", this.accessToken.token);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function getAccessToken() {
        return _getAccessToken.apply(this, arguments);
      };
    }()
  }, {
    key: "login",
    value: function () {
      var _login = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(username, password) {
        var tokenConfig, tokenData;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                tokenConfig = {
                  username: username,
                  password: password
                };
                _context3.next = 3;
                return oauthClient.ownerPassword.getToken(tokenConfig);

              case 3:
                tokenData = _context3.sent;
                this.setAccessToken(tokenData);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function login(_x, _x2) {
        return _login.apply(this, arguments);
      };
    }()
  }, {
    key: "apiRequest",
    value: function () {
      var _apiRequest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(resource, method) {
        var response;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return this.assertAccessToken();

              case 2:
                _context4.next = 4;
                return this.axios[method || 'get'](resource);

              case 4:
                response = _context4.sent;
                return _context4.abrupt("return", response.data);

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      return function apiRequest(_x3, _x4) {
        return _apiRequest.apply(this, arguments);
      };
    }()
  }, {
    key: "getMe",
    value: function () {
      var _getMe = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", this.apiRequest('me'));

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      return function getMe() {
        return _getMe.apply(this, arguments);
      };
    }()
  }, {
    key: "getFriendRequests",
    value: function () {
      var _getFriendRequests = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", this.apiRequest('me/friendrequests'));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      return function getFriendRequests() {
        return _getFriendRequests.apply(this, arguments);
      };
    }()
  }, {
    key: "getFriendRequestsSent",
    value: function () {
      var _getFriendRequestsSent = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", this.apiRequest('me/friendrequests?filter=sent'));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      return function getFriendRequestsSent() {
        return _getFriendRequestsSent.apply(this, arguments);
      };
    }()
  }, {
    key: "acceptFriendRequest",
    value: function () {
      var _acceptFriendRequest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(friendRequestId) {
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", this.apiRequest("me/friendrequests/".concat(friendRequestId), 'put'));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function acceptFriendRequest(_x5) {
        return _acceptFriendRequest.apply(this, arguments);
      };
    }()
  }]);

  function FetLife(options) {
    _classCallCheck(this, FetLife);

    this.accessToken = null;
    this.axios = Axios.create({
      headers: _objectSpread({}, headers),
      baseURL: "".concat(baseUri, "/api/v2")
    });

    if (_.has(options, 'accessToken')) {
      this.setAccessToken(options.accessToken);
    }

    this.onTokenRefresh = _.get(options, 'onTokenRefresh', null);
  }

  return FetLife;
}();

module.exports = FetLife;