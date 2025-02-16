import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { any } from "zod";

export const isManage = async(req: Request, res: Response, next: NextFunction) => {
    try{
        const takeToken = req.headers.authorization?.split(" ")[1];
        if(!takeToken){
            return res.status(401).json({message: "Unauthorized !"});    
        }
        const decoded = jwt.verify(takeToken, process.env.JWT_SECRET as string) as {userId:string};
        const findUserbyID = await User.findById(decoded.userId);
        if (!findUserbyID || findUserbyID.role !== "Manager"){
            return res.status(403).json({message: "Access denied !"});
        }
        
        next();

    }catch (e){
        res.status(401).json({ message: "Invalid token" });
    }
}