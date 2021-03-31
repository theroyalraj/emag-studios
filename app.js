const express = require("express");
const path = require("path");
const hbs = require("hbs");
const nodemailer = require("nodemailer");
// require("dotenv").config();

const app = express();

// app.use(express.static(__dirname + 'public'))
app.use("/style", express.static(path.join(__dirname, "public/style")));
app.use("/script", express.static(path.join(__dirname, "public/script")));
app.use("/image", express.static(path.join(__dirname, "public/image")));

//setting path
const publicDirectoryPath = path.join(__dirname, "/public");
const viewsPath = path.join(__dirname, "/views");
const partialsPath = path.join(__dirname, "/views/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
  // res.sendFile(process.cwd() + "/public/index.html")
});

app.get("/admin", (req, res) => {
  res.send("Admin")
})

app.post("/", (req, res) => {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: "emagstudiosofficial@gmail.com",
    subject: `${req.body.name} wants to contact you!`,
    text: `Hi, I am ${req.body.name} \n Email: ${req.body.email} \n Contact me: ${req.body.number} \n Message: ${req.body.message}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send('error')
    } else {
      console.log("Email sent: " + info.response);
      res.send('success')
    }
  });
});
app.get("*", (req,res) => {
  res.send("<h1> Opps!! something went wrong </h1>")
})


app.listen(80, () => {
  console.log("server state at 80");
});
