import mongoose, {Schema} from "mongoose";


const employeesInGymSchema = new Schema(
    
    {
        // Link to the primary User model for auth and roles
        userAccount: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        
        // --- Personal Information (can be inherited from User or stored here) ---
        // Note: Some of this data might already exist in the User schema.
        // You can decide whether to duplicate it here for HR purposes or reference it.
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        dateOfBirth: { type: Date, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'] },
        address: {
            street: String,
            city: String,
            state: String,
            pinCode: String,
        },
        mobileNumber: { type: String, required: true },
        homeNumber: { type: String },
        physicalStats: {
            weightKg: Number,
            heightCm: Number,
        },

        // --- Professional Qualifications ---
        professionalQualifications: {
            certifications: [String], // e.g., ["Certified Personal Trainer", "Group Fitness Instructor"]
            educationBackground: String,
            previousWorkExperience: String,
            references: [{
                name: String,
                contactInfo: String,
            }],
        },

        // --- Employment Information ---
        employmentDetails: {
            jobTitle: { 
                type: String, 
                required: true,
                enum: ['Manager', 'Personal Trainer', 'Front Desk', 'Cleaner'] 
            },
            availability: {
                workDays: [String], // e.g., ["Monday", "Wednesday", "Friday"]
                preferredShift: String, // e.g., "Morning", "Evening"
            },
            salaryExpectations: String,
            startDate: { type: Date, required: true },
            status: {
                type: String,
                enum: ['Active', 'Inactive', 'On Leave'],
                default: 'Active',
            }
        },

        // --- Emergency Contact ---
        emergencyContact: {
            fullName: { type: String, required: true },
            relationship: String,
            mobileNumber: { type: String, required: true },
        },

        // --- Bank Details ---
        bankDetails: {
            accountNumber: { type: String, required: true },
            ifscCode: { type: String, required: true },
            bankName: { type: String, required: true },
        },

        // --- System & Branch Information ---
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Employee must be associated with a branch.'],
        },
        // Link to the document/image of the physical form
        formImage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'EmployeeImage'
        },
    }, 
    {
        timestamps: true,
    }
);


export const employeesInGym = mongoose.model("employeesInGym", employeesInGymSchema)
