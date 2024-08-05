"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const functions_1 = require("./functions");
const utils_1 = require("src/utils");
class AuthMiddleware {
    constructor(option) {
        this.option = option;
    }
    staticUsersAuthorizer(username, password) {
        const { users } = this.option;
        for (const i in users) {
            if ((0, functions_1.compare)(username, i) && (0, functions_1.compare)(password, users[i])) {
                return true;
            }
        }
        return false;
    }
    build() {
        const challenge = this.option.challenge !== undefined ? !!this.option.challenge : false;
        const users = this.option.users || {};
        const authorizer = this.option.authorizer || this.staticUsersAuthorizer.bind(this);
        const isAsync = this.option.authorizeAsync !== undefined
            ? !!this.option.authorizeAsync
            : false;
        const getResponseBody = (0, functions_1.ensure)(this.option.unauthorizedResponse, '');
        const realm = (0, functions_1.ensure)(this.option.realm);
        (0, assert_1.default)(typeof users === 'object', 'Expected an object for the basic auth users, found ' +
            typeof users +
            ' instead');
        (0, assert_1.default)(typeof authorizer === 'function', 'Expected a function for the basic auth authorizer, found ' +
            typeof authorizer +
            ' instead');
        return (req, res, next) => {
            const authentication = (0, utils_1.auth)(req);
            if (!authentication) {
                return unauthorized();
            }
            req.auth = {
                username: authentication.username,
                password: authentication.password,
            };
            if (isAsync) {
                return authorizer(authentication.username, authentication.password, authorizerCallback);
            }
            else if (!authorizer(authentication.username, authentication.password)) {
                return unauthorized();
            }
            return next();
            function unauthorized() {
                if (challenge) {
                    let challengeString = 'Basic';
                    const realmName = realm(req);
                    if (realmName) {
                        challengeString += ' realm="' + realmName + '"';
                    }
                    res.set('WWW-Authenticate', challengeString);
                }
                const response = getResponseBody(req);
                if (typeof response === 'string') {
                    return res.status(401).send(response);
                }
                return res.status(401).json(response);
            }
            function authorizerCallback(err, approved) {
                assert_1.default.ifError(err);
                if (approved) {
                    return next();
                }
                return unauthorized();
            }
        };
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map