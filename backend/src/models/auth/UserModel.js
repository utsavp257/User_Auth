import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please add a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please add password!"]
    },
    photo: {
        type: String,
        default: "https://media.istockphoto.com/id/187722063/photo/funny-man-with-watermelon-helmet-and-goggles.jpg?s=612x612&w=0&k=20&c=gRAm8vtLqdOU8a-mJVt6m_Wnv8pLpa3TBh2vRQP4208="
    },
    bio: {
        type: String,
        default: "I am a new user.",
      },
  
      role: {
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",
      },
  
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true, minimize: true }
);
//hash pwd
UserSchema.pre("save", async function(next){
    //check if pwd is not modified
    if(!this.isModified("password")){
        return next();
    }

    const salt = await bcrypt.genSalt(10);

    //hash the pwd w salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    next();

})


const User = mongoose.model("User", UserSchema);

export default User;