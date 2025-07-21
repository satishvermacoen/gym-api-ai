import mongoose, {Schema} from "mongoose";


const expenseGymSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Expense type must have a name.'],
            trim: true,
            maxlength: [100, 'Expense type name cannot exceed 100 characters.'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters.'],
        },
        amount: {
            type: Number,
            required: [true, 'Expense must have an amount.'],
        },
        upcomingdate: {
            type: Date,
            required: [true, 'Expense must have a date.'],
        },


        // Scopes the expense type to a specific gym branch.
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BranchGym',
            required: [true, 'An expense type must be associated with a branch.'],
        },
        // The user who created this custom expense type.
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserOwner',
            required: [true, 'An expense type must have a creator.'],
        },
    },
    {
        timestamps: true
    }
);


export const expenseGym = mongoose.model("ExpenseGym", expenseGymSchema)
