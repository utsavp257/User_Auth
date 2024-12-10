import asyncHandler from "express-async-handler";
import jwt from 'jsonwebtoken'
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            res.status(401).json({ message: "Not authorized, please login"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        //check if user exists
        if(!user){
            res.status(404).json({ message: "User not found"});
        }
        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({message: "Unauthorized , token failed"})
    }
});

export const adminMiddleware = asyncHandler(async (req, res, next)=> {
    if(req.user && req.user.role == "admin"){
        next();
        return;
    }
    res.status(403).json({message: "This is an admins-only action!"});
});