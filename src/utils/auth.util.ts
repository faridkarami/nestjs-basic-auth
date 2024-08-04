const REGEXP = {
  credentials: /^ *(?:basic) +([A-Za-z0-9._~+/-]+=*) *$/i,
  usernamePassword: /^([^:]*):([^:]*)$/,
};

interface Request {
  headers?: {
    authorization?: string;
  };
}

class Credentials {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

const decodeBase64 = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

const getAuthorization = (request: Request): string | undefined => {
  if (!request.headers || typeof request.headers !== 'object') {
    throw new TypeError(
      'argument "request" must include a "headers" property.',
    );
  }

  return request.headers.authorization || '';
};

const parse = (str: string): Credentials | undefined => {
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

const auth = (request: Request): Credentials => {
  if (!request) {
    throw new TypeError('argument "request" is required');
  }

  if (typeof request !== 'object') {
    throw new TypeError('argument "request" is required to be an object');
  }

  const header = getAuthorization(request);

  return parse(header);
};

export { Credentials, auth, parse };
