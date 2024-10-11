const path = require('path');
const multer = require('multer');
const express = require('express');
const mongoose = require('mongoose');

const authRoute = require('./auth');

const mySecret = process.env['moong'];


const connectdb = async () => {
  try {

    const connect = await mongoose.connect(mySecret, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected:", connect.connection.host, connect.connection.name);
  } catch (err) {
    console.log("Error connecting to database:", err);
    process.exit(1); 
  }
};


connectdb();


const app = express();
const port = process.env.PORT || 5000;


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/assignments", assignmentRoute);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});



app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));


app.get("/", (req, res) => {
  return res.render("homepage");
});





app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
