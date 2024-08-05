type Authorizer = (username: string, password: string, callback?: (err: Error | null, approved: boolean) => void) => boolean | void;
type UnauthorizedResponse = string | ((req: any) => string | object);
type Realm = (req: any) => string;
