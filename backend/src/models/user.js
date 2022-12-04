import mongoose from "mongoose";
import { compareSync, hashSync } from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      validate: {
        validator: (username) => User.doesNotExist({ username }),
        message: "Username already exist",
      },
    },
    email: {
      type: String,
      validate: {
        validator: (email) => User.doesNotExist({ email }),
        message: "Email already exist",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//double checking for hashing the password if in case it modified
UserSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = hashSync(this.password, 10);
  }
});

//double checking user does not exist with same name and email
UserSchema.statics.doesNotExist = async function (field) {
  return (await this.where(field).countDocuments()) === 0;
};

//comparing password
UserSchema.methods.comparePasswords = function (password) {
  return compareSync(password, this.password);
};
const User = mongoose.model("User", UserSchema);
export default User;
