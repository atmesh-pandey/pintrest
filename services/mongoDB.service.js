const mongoose = require("mongoose");

const mongodb = () => {
  try {
    const dburl = process.env.MONGO_URL;
    mongoose.connect(dburl);

    mongoose.connection.on("connected", () => {
      console.log(`connected to mongoDB`);
    });

    mongoose.set('debug', true);

    mongoose.connection.on("error", (err) => {
      console.log(`MongoDB has occured ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    process.on("SIGINT", () => {
      mongoose.connection.close(() => {
        console.log("MongoDB is disconnected due to application termination");
        process.exit(0);
      });
    });
  } catch (e) { }
};

module.exports = mongodb