import { Document, Model, model, models, Schema, Types } from "mongoose";
import { IFeedbackInput } from "../validators/feedback.validator";

export interface IFeedback extends Document, IFeedbackInput {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const feedbackSchema = new Schema<IFeedback>(
    {
        userId: { 
            type: String, 
            ref: 'User', 
            required: true 
        },
        productId: { 
            type: String, 
            ref: 'Product', 
            required: true 
        },
        rating: { 
            type: Number, 
            required: true,
            min: 0,
            max: 5,
            validate: {
                validator: (value: number) => value % 0.5 === 0,
                message: "Rating must be a multiple of 0.5"
            }
        },
        comment: { 
            type: String,
            minlength: 3,
            maxlength: 500,
            required: false
        },
        images: [{ 
            type: String,
            validate: {
                validator: (url: string) => {
                    try {
                        new URL(url);
                        return true;
                    } catch {
                        return false;
                    }
                },
                message: "Invalid image URL"
            }
        }],
        purchaseVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

// Compound index to ensure one feedback per user per product
feedbackSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Feedback = (models.Feedback as Model<IFeedback>) || model<IFeedback>("Feedback", feedbackSchema);

export default Feedback; 