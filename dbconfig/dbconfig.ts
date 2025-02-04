import mongoose from "mongoose";

export async function connect() {
  try {

    //connect with mongodb
     await mongoose.connect(process.env.MONGO_URL!); //here ! for typescript that define MONGO_URL come must

    //following this because after the db connect not accure any issue
    const connection = mongoose.connection;

    //if connected successfully
    connection.on("connected", () => {
      console.log("mongodb connected");
    });

    //if accure error
    connection.on("error", (error) => {
      console.log("error in mongodb connection process", + error);
      process.exit(); //if accure error then exit from that process
    });

  } 
  catch (error) {
    console.log("something went wrong in db connection process");
    console.log(error);
  }
}
