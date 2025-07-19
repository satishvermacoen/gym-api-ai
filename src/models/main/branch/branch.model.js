import mongoose, {Schema} from "mongoose";


const branchGymSchema = new Schema(
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


export const branchGym = mongoose.model("BranchGym", branchGymSchema)
