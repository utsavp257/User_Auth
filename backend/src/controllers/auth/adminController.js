import asyncHandler from 'express-async-handler';
import User from "../../models/auth/UserModel.js"
import mongoose from "mongoose";

export const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.params;
    //find and delete user;
    const user = await User.findByIdAndDelete(id);
    if(!user){
        res.status(404).json({message: "User not found!"});
    }
    res.status(200).json({message: "User deleted"});
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    if (!users){
        res.status(404).json({message: "No users found"});
    }
    res.status(200).json(users);
});
