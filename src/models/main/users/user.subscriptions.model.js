import mongoose, {Schema} from "mongoose";


const userOwnerSubscriptionSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true, 
        },
    },
    {
        timestamps: true
    }        
    
);


export const UserOwnerSubscription = mongoose.model("UserOwnerSubscription", userOwnerSubscriptionSchema)
