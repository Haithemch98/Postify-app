const mongoose = require("mongoose");
const uri = process.env.MONGODB_URL;


mongoose.set('strictQuery', false);

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error in DB connection: ", error);
  });
