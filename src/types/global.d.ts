import { User } from "@prisma/client";

type UserAccount = User;

declare global {
  namespace Express {
    interface User extends UserAccount {}
  }
}
