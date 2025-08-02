import {User} from "../models/user.model.js";
import { upsertStreamUser } from "../lib/stream.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
    const {email,password,fullname} = req.body;
    try{
        if(!email || !password || !fullname) {
            return res.status(400).json({message: "All fields are required"});
        }
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)) {
            return res.status(400).json({message: "Invalid email format"});
        }

        const existing = await User.findOne({email});
        if(existing){
            return res.status(400).json({message: "User already exists with this email"});
        }

        const idx =Math.floor(Math.random() * 100)+1;   //generate a num between 1 - 100
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`; //only allowed  1- 100 on avatar

        const newUser = await User.create({
            email, 
            fullname,
            password,
            profilePhoto:randomAvatar,
        })
        
        //TODO: create a user in stream as well

        try{
            await upsertStreamUser({
                id:newUser._id.toString(),
                name: newUser.fullname,
                image: newUser.profilePhoto || "",
            })
            console.log(`Stream user created for ${newUser.fullname}`);
        }catch(err){
            console.error("Error creating Stream user:", err);
            return res.status(500).json({message: "Error creating Stream user"});
        }

        const token =  jwt.sign({userId: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
            httpOnly: true, //prevent XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", //prevent CSRF attacks
        });

        res.status(201).json({message: "User created successfully"});

    }catch(err){
        console.log("error in signup controller ", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export async function login(req, res) {
    const {email, password} = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message:"email and password both are required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "invalid email or password"});
        }
        
        const isCorrectPassword = await user.matchPassword(password);

        if(!isCorrectPassword){
            return res.status(401).json({message: "invalid email or password"});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        
        res.status(200).json({message: "Login successful",user});

    }catch(err){
        console.log("error in login controller ", err);
        res.status(500).json({message: "Internal server error"});
    }
}

export function logout(req, res) {
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({message: "Logout successful"});
}

export async function onboard(req, res) {
    try{

        const userId= req.user._id;
        if(!userId) {
            return res.status(401).json({message: "Unauthorized access"});
        }

        const {fullname, bio, nativeLang, learningLang, location} = req.body;
        
        if(!fullname || !bio ||!nativeLang || !learningLang || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingfields:[
                    !fullname && "fullname",
                    !bio && "bio",
                    !nativeLang && "nativeLang",
                    !learningLang && "learningLang",
                    !location && "location"
                ],
            });
        }

        const updateUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        },{new:true});


        if(!updateUser) {
            return res.status(404).json({message: "User not found"});
        }

        // Update Stream user as well
        try{
            await upsertStreamUser({
                id:updateUser._id.toString(),
                name: updateUser.fullname,
                image: updateUser.profilePhoto || "",
                bio: updateUser.bio,
                nativeLang: updateUser.nativeLang,
                learningLang: updateUser.learningLang,
                location: updateUser.location,
            });
            console.log(`Stream user updated for ${updateUser.fullname}`);
        } catch(err){
            console.error("Error updating Stream user:", err);
            return res.status(500).json({message: "Error updating Stream user"});
        }



        res.status(200).json({message: "Onboarding successful", user: updateUser});

    }catch(err){
        console.error("Error in onboarding controller:", err);
        res.status(500).json({message: "Internal server error"});
    }
}
