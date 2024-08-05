import * as assert from 'assert';
import { timingSafeEqual } from 'crypto';
import { auth } from './utils';

interface Options {
  challenge?: boolean;
  users?: { [key: string]: string };
  authorizer?: Authorizer;
  authorizeAsync?: boolean;
  unauthorizedResponse?: UnauthorizedResponse;
  realm?: Realm;
}

type Authorizer = (
  username: string,
  password: string,
  callback?: (err: Error | null, approved: boolean) => void,
) => boolean | void;
type UnauthorizedResponse = string | ((req: any) => string | object);
type Realm = (req: any) => string;

class AuthMiddlewareBuilder {
  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  static safeCompare(userInput: string, secret: string): boolean {
    const userInputLength = Buffer.byteLength(userInput);
    const secretLength = Buffer.byteLength(secret);

    const userInputBuffer = Buffer.alloc(userInputLength, 0, 'utf8');
    userInputBuffer.write(userInput);
    const secretBuffer = Buffer.alloc(secretLength, 0, 'utf8');
    secretBuffer.write(secret);

    return !!(
      timingSafeEqual(userInputBuffer, secretBuffer) &&
      userInputLength === secretLength
    );
  }

  private ensureFunction<T>(option: T | undefined, defaultValue?: T): () => T {
    if (option === undefined) {
      return () => defaultValue as T;
    }

    if (typeof option !== 'function') {
      return () => option;
    }

    return option as () => T;
  }

  private staticUsersAuthorizer(username: string, password: string): boolean {
    const { users } = this.options;
    for (const i in users) {
      if (
        AuthMiddlewareBuilder.safeCompare(username, i) &&
        AuthMiddlewareBuilder.safeCompare(password, users[i])
      ) {
        return true;
      }
    }

    return false;
  }

  build() {
    const challenge =
      this.options.challenge !== undefined ? !!this.options.challenge : false;
    const users = this.options.users || {};
    const authorizer =
      this.options.authorizer || this.staticUsersAuthorizer.bind(this);
    const isAsync =
      this.options.authorizeAsync !== undefined
        ? !!this.options.authorizeAsync
        : false;
    const getResponseBody = this.ensureFunction(
      this.options.unauthorizedResponse,
      '',
    ) as (req: any) => string | object;
    const realm = this.ensureFunction(this.options.realm) as unknown as (
      req: any,
    ) => string;

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
        user: authentication.username,
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

export default AuthMiddlewareBuilder;
