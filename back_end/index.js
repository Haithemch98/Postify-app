const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const path = require('path')
const fs = require('fs')


const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const userRoutes = require('./routes/user');
const commentRoutes = require('./routes/comment');



const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(express.json());
dotenv.config();
require('./db/connection');

const uploadDir = path.join(__dirname,"assets")

if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir)
}

app.use("/assets",express.static(path.resolve(__dirname,"./assets")))

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comment", commentRoutes);



const PORT = process.env.PORT || 8800;


server.listen(PORT, () => {
  console.log(`Server connected at port ${PORT}`);
});
