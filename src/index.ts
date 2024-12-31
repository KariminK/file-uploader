import express from "express";
import session from "express-session";
import passport from "passport";
import path from "path";
import { config } from "dotenv";

config();
const app = express();
const port = process.env.PORT ?? 3002;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "mysecr3t",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
