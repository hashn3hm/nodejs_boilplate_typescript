import { Schema, model } from "mongoose";

const DeviceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  deviceToken: { type: Schema.Types.String, default: "" },
  deviceId: { type: Schema.Types.String },
});

const DeviceModel = model("Device", DeviceSchema);

export default DeviceModel;
