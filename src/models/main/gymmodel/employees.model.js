import mongoose, {Schema} from "mongoose";


const employeesInGymSchema = new Schema(
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


export const employeesInGym = mongoose.model("employeesInGym", employeesInGymSchema)
