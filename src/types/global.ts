import { User } from "@prisma/client";

export type UserAccount = User;

declare global {
  namespace Express {
    interface User extends UserAccount {}
  }
}
