import mongoose, {Schema} from "mongoose";


const expenseGymSchema = new Schema(
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


export const expenseGym = mongoose.model("ExpenseGym", expenseGymSchema)
