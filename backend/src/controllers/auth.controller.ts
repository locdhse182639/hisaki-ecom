import User from "../models/user.model"
import {Request, Response} from "express"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 

const JWT_SECRET = process.env.JWT_SECRET || "thisisjwtsecret123"

export const register = async (req: Request, res: Response)=> {
    try{
    const { name, email, password, role, skinType, paymentMethod, address} = req.body;
    
    //ktra email xem ton tai chua?
    const existEmail = await User.findOne({email});
    if (existEmail) 
        return res.status(400).json({error:"Email existed !"});
    const hashedPassword = await bcrypt.hash(password, 10);
    //tao user 
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        skinType,
        paymentMethod: paymentMethod || {},
        address: address || {},
    });
    await newUser.save();
    res.status(201).json({message: "User registerd successfully"})
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req:Request , res:Response)=>
{
    try{
    const {inputEmail, inputPassword} = req.body;
    const userMatch = await User.findOne ({email: inputEmail}).select("+password");
    
    if (!userMatch)
        return res.status(400).json({error: "Invalid email or password !"});
    const passMatch = await bcrypt.compare(inputPassword, userMatch.password)

    if (!passMatch)
        return res.status(400).json({error:"Invalid email or password !"});

    //tao token cho account
    const token = jwt.sign({id: userMatch._id, role: userMatch.role}, JWT_SECRET, {expiresIn: "7d"});
    res.json({
        token,
        user: {
          id: userMatch._id,
          name: userMatch.name,
          email: userMatch.email,
          role: userMatch.role,
          skinType: userMatch.skinType
        }
      });      
    }catch(error) {
        res.status(500).json({error: "Internal server error"});
    }
};