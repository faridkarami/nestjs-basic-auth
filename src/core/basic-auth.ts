import assert from 'assert';
import { compare, ensure } from './functions';
import { IOption } from './option.interface';
import { auth } from '../utils';

export const basicAuth = (option: IOption) => {
  const challenge = option.challenge !== undefined ? !!option.challenge : false;
  const users = option.users || {};
  const authorizer = option.authorizer || staticUsersAuthorizer;
  const isAsync =
    option.authorizeAsync !== undefined ? !!option.authorizeAsync : false;
  const getResponseBody = ensure(option.unauthorizedResponse, '');
  const realm = ensure(option.realm);

  assert(
    typeof users === 'object',
    'Expected an object for the basic auth users, found ' +
      typeof users +
      ' instead',
  );
  assert(
    typeof authorizer === 'function',
    'Expected a function for the basic auth authorizer, found ' +
      typeof authorizer +
      ' instead',
  );

  function staticUsersAuthorizer(username: string, password: string): boolean {
    for (const i in users) {
      if (compare(username, i) && compare(password, users[i])) {
        return true;
      }
    }

    return false;
  }

  return function authMiddleware(req: any, res: any, next: () => void) {
    const authentication = auth(req);

    if (!authentication) {
      return unauthorized();
    }

    req.auth = {
      username: authentication.username,
      password: authentication.password,
    };

    if (isAsync) {
      return (authorizer as Authorizer)(
        authentication.username,
        authentication.password,
        authorizerCallback,
      );
    } else if (
      !(authorizer as Authorizer)(
        authentication.username,
        authentication.password,
      )
    ) {
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

    function authorizerCallback(err: Error | null, approved: boolean) {
      assert.ifError(err);

      if (approved) {
        return next();
      }

      return unauthorized();
    }
  };
};
