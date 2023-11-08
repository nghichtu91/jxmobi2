export interface ITranlogs {
  ID: number;
  UserID: number;
  RoleID: number;
  RoleName: string;
  ServerID: number;
  Value: number;
  TimeTrans: Date;
  BeforeValue?: number;
  AfterValue?: number;
}
