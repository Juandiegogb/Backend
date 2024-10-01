import mongoose from "mongoose";

export const dbConnect = () => {
  const uri = process.env.MONGO_URI;
  mongoose
    .connect(uri, { dbName: "agenda-contactos" })
    .then(() => {
      console.log("DB is ready");
    })
    .catch((error) => {
      console.log(error);
    });
};
