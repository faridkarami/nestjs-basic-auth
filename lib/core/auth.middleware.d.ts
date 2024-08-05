import { IOption } from './option.interface';
declare class AuthMiddleware {
    private option;
    constructor(option: IOption);
    private staticUsersAuthorizer;
    build(): (req: any, res: any, next: () => void) => any;
}
export default AuthMiddleware;
