import mongoose, {Schema} from "mongoose";


const expenseGymSchema = new Schema(
    {
        typeofExpense: {
            type: String,
            enum: ['Bill', 'Rent', 'Other'],
            required: [true, 'Expense must have a type.'],
            },
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
        duedate: {
            type: Date,
            required: [true, 'Expense must have a date.'],
        },
        status: {
            type: String,
            enum: ['Pending', 'Fully Paid', 'Overdue', 'Partially Paid'],
            default: 'Pending',
        },


        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'An expense type must be associated with a branch.'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'UserOwner',
            required: [true, 'An expense type must have a creator.'],
        },
    },
    {
        timestamps: true
    }
);


export const Expense = mongoose.model("Expense", expenseGymSchema)
