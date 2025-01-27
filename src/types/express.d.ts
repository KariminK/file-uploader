import { user } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends user {}
  }
}
