import assert from 'assert';
import { compare, ensure } from './functions';
import { IOption } from './option.interface';
import { auth } from 'src/utils';

class AuthMiddleware {
  private option: IOption;

  constructor(option: IOption) {
    this.option = option;
  }

  private staticUsersAuthorizer(username: string, password: string): boolean {
    const { users } = this.option;
    for (const i in users) {
      if (compare(username, i) && compare(password, users[i])) {
        return true;
      }
    }

    return false;
  }

  build() {
    const challenge =
      this.option.challenge !== undefined ? !!this.option.challenge : false;
    const users = this.option.users || {};
    const authorizer =
      this.option.authorizer || this.staticUsersAuthorizer.bind(this);
    const isAsync =
      this.option.authorizeAsync !== undefined
        ? !!this.option.authorizeAsync
        : false;
    const getResponseBody = ensure(this.option.unauthorizedResponse, '') as (
      req: any,
    ) => string | object;
    const realm = ensure(this.option.realm) as (req: any) => Realm;

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

    return (req: any, res: any, next: () => void) => {
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
  }
}

export default AuthMiddleware;
