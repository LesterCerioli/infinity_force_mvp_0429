import mongoose, { ConnectOptions } from "mongoose";
import Fawn from "fawn";

/
const connectToDatabase = (): void => {
  const connectionOptions: ConnectOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose
    .connect(process.env.MONGO_URI as string, connectionOptions)
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err: Error) => {
      console.error("Failed to connect to the database on startup - retrying in 5 sec");
      setTimeout(connectToDatabase, 5000);
    });

  return Fawn.init(mongoose, process.env.TRANS_COLL as string);
};

export default connectToDatabase;
