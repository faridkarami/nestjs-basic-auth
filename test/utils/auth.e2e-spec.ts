import { auth, parse, Credentials } from '../../src/utils'; // Adjust the import path

describe('auth', () => {
  test('throws error if request is not provided', () => {
    expect(() => auth(undefined as any)).toThrow(
      'argument "request" is required',
    );
  });

  test('throws error if request is not an object', () => {
    expect(() => auth('string' as any)).toThrow(
      'argument "request" is required to be an object',
    );
  });

  test('throws error if request.headers is missing or not an object', () => {
    expect(() => auth({} as any)).toThrow(
      'argument "request" must include a "headers" property.',
    );
    expect(() => auth({ headers: 'string' } as any)).toThrow(
      'argument "request" must include a "headers" property.',
    );
  });

  test('parses valid basic auth header', () => {
    const req = {
      headers: {
        authorization: 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=', // base64 for "username:password"
      },
    };
    const result = auth(req);
    expect(result).toEqual(new Credentials('username', 'password'));
  });

  test('returns undefined for invalid basic auth header', () => {
    const req = {
      headers: {
        authorization: 'InvalidHeader',
      },
    };
    expect(auth(req)).toBeUndefined();
  });

  test('returns undefined for missing authorization header', () => {
    const req = {
      headers: {},
    };
    expect(auth(req)).toBeUndefined();
  });

  test('returns undefined if authorization header is empty', () => {
    const req = {
      headers: {
        authorization: '',
      },
    };
    expect(auth(req)).toBeUndefined();
  });
});

describe('parse', () => {
  test('returns Credentials object for valid basic auth string', () => {
    const result = parse('Basic dXNlcm5hbWU6cGFzc3dvcmQ='); // base64 for "username:password"
    expect(result).toEqual(new Credentials('username', 'password'));
  });

  test('returns undefined for invalid basic auth string', () => {
    expect(parse('InvalidHeader')).toBeUndefined();
    expect(parse('Basic dXNlcm5hbWU6cGFzc3dvcmQ6')).toBeUndefined(); // username password with colon in password
  });

  test('returns undefined if input is not a string', () => {
    expect(parse({} as any)).toBeUndefined();
    expect(parse([] as any)).toBeUndefined();
    expect(parse(123 as any)).toBeUndefined();
  });
});
