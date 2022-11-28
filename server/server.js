const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./api/v1/hearmenow/index");
const SDG = require("./api/v1/hearmenow/sdg/sdg.model");
const path = require('path')
// Main server application and port
const app = express();

app.use("/api/v1/hearmenow/", indexRouter);

mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    app.listen(process.env.SERVER_PORT);

    // Create the SDGs if they have not yet been created
    SDG.find({}, (err, goals) => {

      if(!goals.length){

        const names = ["POVERTY", "HUNGER", "HEALTH", "EDUCATION", "GENDER", "WATER", "ENERGY", "ECONOMIC", "INDUSTRY", 
          "INEQUALITIES", "COMMUNITIES", "CONSUMPTION", "CLIMATE", "SEA_LIFE", "LAND_LIFE", "PEACE", "PARTNERSHIPS"]
        
        for(let i = 0; i < 17; i++){
          const sdg = new SDG({
            name: names[i],
            code: i + 1,
          });
          sdg.save();
        }

      }

    })

    console.log("Connected!")
  })
  .catch((err) => {
    console.log(err);
  });
