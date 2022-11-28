const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./api/v1/hearmenow/index");
const group = require("./api/v1/hearmenow/group/group.model");
const path = require('path')
// Main server application and port
const app = express();

app.use("/api/v1/hearmenow/", indexRouter);


mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    app.listen(process.env.SERVER_PORT);

    var db = mongoose.db('hmn-dev');
    db.collection('groups').findOne({} {
        console.log(result.name);
        mongoose.close();
    }
    
  })
  .catch((err) => {
    console.log(err);
  });
  

  
