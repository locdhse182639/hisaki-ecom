import {Schema, model, Document} from "mongoose";

export interface IRole extends Document {
 name: string;
 description?: string;
 permissions?: string[];
 isActive: boolean;
 createdAt: Date;
 updatedAt: Date;
    
}
const RoleSchema = new Schema(
    {
    name: 
    {
    type: String, 
    require: [true, "Role nam is required"],
    enum: ["User", "Customer", "Staff", "Manager"],
    default: "User",
    unique: true,
    trim: true
    },
    description: {
    type: String,
    trim: true,
    maxlength: [200, "Description cannot exceed 200 characters"]
    },
    permissions: [{
        type: String,
        trim: true 
    }],
    isActive: {
        type: String,
        trim: true
    }
},
    {timestamps: true}
);

export default model<IRole>("Role", RoleSchema);