import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please fill in your username"],
      unique: true,
      maxlength: [30],
    },
    photo: {
      type: String,
      default: "https://shorturl.at/DLX09",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        // There is a comment here
        validator: function (val) {
          return val === this.password;
        },
        message: "Password does not match",
      },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);

  // userSchema.methods.changedPasswordAfter =
};

userSchema.methods.isValidatePassword = async function(sentPassword){
  return await bcrypt.compare(sentPassword, this.password); 
}

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

export const UserModel = mongoose.model("User", userSchema);

// export default UserModel;
