import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { config } from "dotenv";
import indexRouter from "./controllers";
import passportLocal from "passport-local";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import prisma from "./db/prisma";
import bcrypt from "bcryptjs";
import "./types";

config();

const LocalStrategy = passportLocal.Strategy;
const app = express();
const port = process.env.PORT ?? 3000;
// to powinno iść z envów, każdy powinien móc sobie ustalić jaki expire chce
// poza tym przy takich zmiennych warto już w samej nazwie dać znać w jakiej to jest jednostce
// np. sessionExpireInMinutes albo sessionExpireInM
const sessionExpire = 15 * 60 * 1000; // 15 minutes

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
    }
  )
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
    // secret powinien iść też z envów :)
    secret: "mysecr3t",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: sessionExpire,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use(indexRouter);

app.listen(port, () => console.log(`Server listening on port ${port}`));
