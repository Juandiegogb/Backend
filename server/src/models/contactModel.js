import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 6 },
  number: { type: String, required: true, minlength: 8 },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("contact", contactSchema);
