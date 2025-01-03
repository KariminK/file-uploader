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
import "./types/global";
config();

const LocalStrategy = passportLocal.Strategy;
const app = express();
const port = process.env.PORT ?? 3002;
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
        console.log("EMAIL: ", email, "PASSWORD: ", password);
        if (!user) return done(null, false, { message: "Invalid username" });
        const passwordsAreEqual = bcrypt.compare(password, user.password);
        if (!passwordsAreEqual)
          done(null, false, { message: "Invalid password" });
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
    await prisma.$connect();
    const user = await prisma.user.findFirst({ where: { id: id } });
    await prisma.$disconnect();
    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.use(
  session({
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
