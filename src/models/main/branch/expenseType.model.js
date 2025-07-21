// /models/ExpenseType.js
import mongoose from 'mongoose';

/**
 * Represents a custom category for expenses.
 * Each branch can define its own set of expense types,
 * allowing for flexible and tailored financial tracking.
 * For example: "Utilities", "Equipment Repair", "Marketing Campaigns", "Staff Payroll".
 */
const expenseTypeSchema = new mongoose.Schema({
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
  // To prevent duplicate expense types within the same branch.
  // A branch cannot have two expense types with the same name.
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create a compound index to ensure that an expense type name is unique per branch.
expenseTypeSchema.index({ name: 1, branch: 1 }, { unique: true });

const ExpenseType = mongoose.models.ExpenseType || mongoose.model('ExpenseType', expenseTypeSchema);

export default ExpenseType;
