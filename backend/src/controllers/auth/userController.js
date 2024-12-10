import asyncHandler from 'express-async-handler';
import User from "../../models/auth/UserModel.js"
import generateToken from '../../helpers/generateToken.js';
import bcrypt from 'bcrypt';


export const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;
    //validate user
    if(!name || !email || !password){
        //400 bad request
        res.status(400).json({ message: "All fields are required"});
    }

    //check pwd length
    if(password.length < 6){
        return res
            .status(400)
            .json({ message: "Password must be at least 6 characters buddy"});
    }

    //check if user exists alr
    const userExists = await User.findOne({ email });
    if (userExists){
        return res.status(400).json({ message: "User Already Exists"});
    }

    //create user
    const user = await User.create({
       name,
       email,
       password, 
    });

    //generate token w user id
    const token = generateToken(user._id);

    //send back user and token in the response to the client

    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30*24*60*60*1000, //30 days
        sameSite: true,
        secure: true,
    });

    if(user){
        const {_id, name, email, role, photo, bio, isVerified } = user
        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio, 
            isVerified,
            token,
        });
    }
    else{
        res.status(400).json({ message: "Invalid User Data"})
    }
});

//user login

export const loginUser = asyncHandler(async(req, res) => {
    //get email and pwd from req    
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message: "All fields are required buddy"})
    }

    //check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists){
        return res.status(404).json({ message: "User Not found, Sign Up"});
    }


    //check if pwd matches the hashed pwd in db
    const isMatch = await bcrypt.compare(password, userExists.password);

    if(!isMatch){
        return res.status(400).json({ message: "Invalid credentials"});
    }

    //generate token with user id
    const token = generateToken(userExists._id);
    
    if(userExists && isMatch){
        const {_id, name, email, role, photo, bio, isVerified} = userExists;

        //set token in cookie
        res.cookie("token", token, {
            path: "/",
            httpOnly: true,
            maxAge: 30*24*60*60*1000, // 30days
            sameSite: true,
            secure: true,
        });

        //send back the user and the token in the response to the client
        res.status(201).json({
            _id,
            name,
            email,
            role,
            photo,
            bio, 
            isVerified,
            token,
        });
    }
    else{
        res.status(400).json({ message: "Invalid User Data"})
    }
});


//user logout
export const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "User Logged out"})
});

//get user profile
export const getUser = asyncHandler(async (req, res) => {
    //get user deets from token
    console.log("get user");
    const user = await User.findById(req.user._id).select("-password");
    if(user){
        res.status(200).json(user);
    }
    else{
        res.status(404).json({ message: "User not found"});
    }
});

//update user
export const updateUser = asyncHandler(async (req, res) => {
    //get user deets from token from protect middleware
    const user = await User.findById(req.user._id);

    if(user){
        const{ name, bio, photo} = req.body;
        user.name = name || user.name;
        user.bio = bio || user.bio;
        user.photo = photo || user.photo;

        const updated = await user.save();
        res.status(200).json({
            _id: updated.id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            photo: updated.photo,
            bio: updated.bio,
            isVerified: updated.isVerified,
        });
    }
    else{
        res.status(404).json({message : "User not found"});
    }
});
