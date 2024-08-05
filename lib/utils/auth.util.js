"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.auth = exports.Credentials = void 0;
const REGEXP = {
    credentials: /^ *(?:basic) +([A-Za-z0-9._~+/-]+=*) *$/i,
    usernamePassword: /^([^:]*):([^:]*)$/,
};
class Credentials {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}
exports.Credentials = Credentials;
const decodeBase64 = (str) => {
    return Buffer.from(str, 'base64').toString('utf-8');
};
const getAuthorization = (request) => {
    if (!request.headers || typeof request.headers !== 'object') {
        throw new TypeError('argument "request" must include a "headers" property.');
    }
    return request.headers.authorization || '';
};
const parse = (str) => {
    if (typeof str !== 'string') {
        return undefined;
    }
    const match = REGEXP.credentials.exec(str);
    if (!match) {
        return undefined;
    }
    const usernamePassword = REGEXP.usernamePassword.exec(decodeBase64(match[1]));
    if (!usernamePassword) {
        return undefined;
    }
    return new Credentials(usernamePassword[1], usernamePassword[2]);
};
exports.parse = parse;
const auth = (request) => {
    if (!request) {
        throw new TypeError('argument "request" is required');
    }
    if (typeof request !== 'object') {
        throw new TypeError('argument "request" is required to be an object');
    }
    const header = getAuthorization(request);
    return parse(header);
};
exports.auth = auth;
//# sourceMappingURL=auth.util.js.map