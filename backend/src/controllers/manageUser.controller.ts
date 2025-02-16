import {Request, Response} from "express";
import User from "../models/user.model";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();

export const getUserbyId = async (req:Request, res:Response) =>
{
    try{
     const {id} = req.params;
     const user = await User.findById(id).select("-password");
     if (!user){
        return res.status(404).json({ success: false, message: "User not found" });
     }
     res.json({ success: true, user });
    } catch(error: any){
     res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const getAlluser = async (_req: Request, res: Response) =>
{
    try{
        const getAllUser = await User.find().select("-password");
        res.json({ success: true, getAllUser });
    } catch (error:any) {
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) =>
{
    try{
    const {id} = req.params;
    const deleteUserbyId = await User.findByIdAndDelete(id);
    if(!deleteUserbyId){
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
    } catch (error:any) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const updateUser = async (req:Request, res:Response) =>
{
    try{
        const { id } = req.params;
        const updates = req.body;
        
        if(updates.password){
            return res.status(400).json({ success: false, message: "Cannot update password here" });
        }
        const updateUserbyId = await User.findByIdAndUpdate( id, updates, {new:true}).select("-password");
        if (!updateUserbyId){
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, message: "User updated successfully", user: updateUserbyId });

    }catch (error:any) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const suspendUser = async (req: Request, res: Response) => 
{
    const { id } = req.params;
    const suspendUserbyId = await User.findByIdAndUpdate(id, {userStatus: "Inactive"}, {new: true});
    if(!suspendUserbyId){
        return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User suspended successfully", user: suspendUserbyId });
}