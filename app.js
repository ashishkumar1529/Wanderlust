if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/users.js");


const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");
const { register } = require("module");


const MONGO_URL = process.env.ATLASDB_TOKEN;
console.log("Mongo URL:", MONGO_URL);

main()
.then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log( err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));


const store = MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE",err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser",async(req,res)=> {
  let fakeUser = new User ({
    email: "Ashu35896@gmail.com",
    username: "alpha-student"
  });
  let registeredUser = await  User.register(fakeUser,"helloworld45");
  console.log("USER ID:", registeredUser._id);
  res.send(registeredUser);
});


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// app.get("/testlistings", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Beautiful Beach House",
//         description: "A stunning beach house with ocean views and modern amenities.",
//         price: 200,
//         location: "Malibu, California",
//         country: "United States"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) => {
  let { statusCode = 500, message = "something went wrong!"} = err;
  res.status(statusCode).render("error.ejs",{err});
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});