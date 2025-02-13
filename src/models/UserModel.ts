import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: Schema.Types.String, requried: true, unique: true },
    password: { type: Schema.Types.String, requried: true },
    name: { type: Schema.Types.String },
    type: {
      type: Schema.Types.String,
      enum: ["Admin", "User"],
      default: "User",
    },
    address: {
      type: Schema.Types.String,
    },
    profilePicture: {
      type: Schema.Types.String,
      default: "",
    },
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Devices",
      },
    ],
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export default UserModel;
