import FriendRequest from "../models/friendRequest.model.js";
import {User} from "../models/user.model.js";
import mongoose from "mongoose";

export async function getRecommendedUsers(req, res){

    try{
        const currUserId = req.user.id;
        const currUser = req.user;

        if(!currUser) {
            return res.status(401).json({message: "Unauthorized access"});
        }

        const recommendedUsers = await User.find({
            $and:[
                {_id: {$ne: currUserId}},
                {_id: {$nin: currUser.friends}},
                {isOnboarded: true}
            ]
        });

        res.status(200).json(recommendedUsers);
    }catch(err){
        console.error("Error fetching recommended users:", err);
        res.status(500).json({message: "Internal server error"});
    }
};

export async function getMyFriends(req, res) {
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends", "fullname profilePhoto nativeLang learningLang location bio");

        res.status(200).json(user.friends);
    }catch(err){
        console.error("Error fetching friends:", err);
        res.status(500).json({message: "Internal server error"});
    }
};

export async function sendFriendRequest(req, res) {
    try{
        const myId = req.user.id;
        const {id} = req.params;
        
        //prevent sending req to yourself

        if(myId === id){
            return res.status(400).json({message:"you cannot send fruend reques to youself"});
        }

        const recipient = await User.findById(id);

        //if user not exists
        if(!recipient){
            return res.status(404).json({message: "User not found"});
        }

        // you are allready friends
        if(recipient.friends.includes(myId)){
            return res.status(400).json({message: "You are already friends with this user"});
        }

        //request allready exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient:id},
                {sender: id, recipient: myId}
            ]
        });

        if(existingRequest){
            return res.status(400).json({message: "Friend request already exists"});
        }

        //create a friend request and send it 

        const friendRequest= await FriendRequest.create({
            sender: myId,
            recipient: id
        });

        res.status(201).json(friendRequest);
    }catch(err){
        console.error("Error sending friend request: ", err);
        res.status(500).json({message: "Internal server error"});
    }
};

export async function acceptFriendRequest(req, res){
    try{
        const { id }= req.params;

        const friendRequest = await FriendRequest.findById(id);

        if(!friendRequest){
            return res.status(404).json({message:"friend request not found"});
        }

        //verify the recipient

        if(friendRequest.recipient.toString() !==req.user.id){
            return res.status(403).json({message: "You are not authorized to send the request"});
        }

        friendRequest.status = "accepted"
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: {friends: friendRequest.recipient},
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: {friends: friendRequest.sender},
        });

        res.status(200).json({message: "Friend request accepted"});

    }catch(err){
        console.error("Error in acceptFriendRequest controller", err.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export async function getFriendRequests(req,res){
    try{
        // 1. Incoming pending requests for current user
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender","fullname profilePhoto nativeLang learningLang");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient sender","fullname profilePhoto nativeLang learningLang");
        
        res.status(200).json({incomingReqs , acceptedReqs});

        
    }catch(err){
        console.error("Error in getFriendRequest controller", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export async function getOutgoingFriendReqs(req,res){
    try{
        const outgoingReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("sender","fullName profilePhoto nativeLang learningLAng ");

        res.status(200).json(outgoingReqs);

    }catch(err){
        console.error("Error in getOutgoingFriendReqs controller", err.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};
