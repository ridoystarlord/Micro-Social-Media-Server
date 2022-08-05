const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const port = 5000;
// const connectionURL = "mongodb://localhost:27017/microsocialmedia";
const connectionURL = `mongodb+srv://mydbuser1:glZXT0NZWuIppXg6@cluster0.pas4h.mongodb.net/movie?retryWrites=true&w=majority`;
const socialMediaRoutes = require("./Routes/SocialMediaRoutes");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/social-media", socialMediaRoutes);

app.get("/", (req, res) => {
  res.send("Hello Micro Social Media!");
});

mongoose
  .connect(connectionURL)
  .then(() =>
    app.listen(port, () => console.log(`Server is Running on port ${port}`))
  )
  .catch((error) => console.log(error.message));
