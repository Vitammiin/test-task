import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
