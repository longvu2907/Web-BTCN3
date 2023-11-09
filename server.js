const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");

const initDB = require("./db/initDB");

const mainRouter = require("./routers/main.r");
const authRouter = require("./routers/auth.r");
const movieRouter = require("./routers/movie.r");
const castRouter = require("./routers/cast.r");

const app = express();
const port = 20405;

initDB();

app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "container.hbs",
    layoutsDir: "views/_layouts",
    partialsDir: "views/_layouts",
  }),
);
app.set("view engine", "hbs");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "somesecret",
    cookie: { maxAge: 600000 },
  }),
);

app.use("", mainRouter);
app.use("", authRouter);
app.use("/movie", movieRouter);
app.use("/cast", castRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode | 500;
  res.status(statusCode).send(err.message);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
