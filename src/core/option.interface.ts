export interface IOption {
  challenge?: boolean;
  users?: { [key: string]: string };
  authorizer?: Authorizer;
  authorizeAsync?: boolean;
  unauthorizedResponse?: UnauthorizedResponse;
  realm?: Realm;
}
