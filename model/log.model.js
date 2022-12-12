import { Schema, model } from "mongoose";

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  route: { type: String },
  log: { type: String },
  date: { type: Date, default: Date.now }
});

const LogModel = model("Log", logSchema);

export default LogModel;