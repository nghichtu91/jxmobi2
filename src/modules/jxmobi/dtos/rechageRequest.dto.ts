export interface IRechangeRequest {
  Value: number;
  Type?: number;
  UserID: number;
  RoleID: number;
  RoleName: string;
  SeverID?: number;
}

export class RechangeRequest implements IRechangeRequest {
  Type?: number;
  UserID: number;
  RoleID: number;
  RoleName: string;
  SeverID?: number;
  Value: number;
}
