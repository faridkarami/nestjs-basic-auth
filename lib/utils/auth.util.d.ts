interface Request {
    headers?: {
        authorization?: string;
    };
}
declare class Credentials {
    username: string;
    password: string;
    constructor(username: string, password: string);
}
declare const parse: (str: string) => Credentials | undefined;
declare const auth: (request: Request) => Credentials;
export { Credentials, auth, parse };
