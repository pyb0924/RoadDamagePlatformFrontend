export interface Permission {
  id: string;
  name: string;
  children: Permission[];
}

export enum PermissionType {
  User_Add = "添加用户",
  User_Delete = "删除用户",
}

export const permissionTypeList = [
  PermissionType.User_Add,
  PermissionType.User_Delete,
];