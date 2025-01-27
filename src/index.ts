import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { config } from "dotenv";
import passportLocal from "passport-local";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/prisma";
import bcrypt from "bcryptjs";
import {
  authRouter,
  dashboardRouter,
  fileRouter,
  folderRouter,
} from "./routes";

config();

const LocalStrategy = passportLocal.Strategy;
const app = express();
const port = process.env.PORT ?? 3000;
const sessionExpireInMinutes =
  Number(process.env.SESSION_EXPIRE_DURATION) * 60 * 1000;
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error(
    "Session secret is required. Make sure you have SESSION_SECRET variable in your .env file",
  );
}
if (isNaN(sessionExpireInMinutes)) {
  throw new Error("Session expire duration must be number");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Invalid username" });
        }

        const passwordsAreEqual = bcrypt.compare(password, user.password);

        if (!passwordsAreEqual) {
          return done(null, false, { message: "Invalid password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { id: id } });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: sessionExpireInMinutes,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

app.use(passport.session());

app.use("/", dashboardRouter);
app.use("/user", authRouter);
app.use("/file", fileRouter);
app.use("/folder", folderRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
