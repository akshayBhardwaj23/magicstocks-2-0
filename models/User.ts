import mongoose from "mongoose";

// type User = {
//   firstName: string;
//   lastName: string;
//   email: string;
//   image: string;
//   googleId: string;
//   facebookId: string;
//   phone: string;
//   password: string;
//   current_messages: number;
// };

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    image: { type: String || undefined },
    googleId: { type: String || undefined },
    facebookId: { type: String || undefined },
    phone: { type: String },
    password: { type: String },
    current_messages: {
      type: Number,
      default: 2,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      virtuals: true,
      transform: (_, ret) => {
        delete ret._id;
      },
    },
  }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
