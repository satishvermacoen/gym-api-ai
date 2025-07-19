import mongoose, {Schema} from "mongoose";


const membersInGymSchema = new Schema(
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


export const membersInGym = mongoose.model("membersInGym", membersInGymSchema)