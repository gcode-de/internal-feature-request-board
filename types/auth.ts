export enum UserRole {
  Employee = "employee",
  ProductOwner = "product_owner",
  Admin = "admin",
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.Employee]: "Employee",
  [UserRole.ProductOwner]: "Product Owner",
  [UserRole.Admin]: "Admin",
};
