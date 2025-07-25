import mongoose, {Schema} from "mongoose";


const employeesInGymSchema = new Schema(
    
    {
        // Link to the primary User model for auth and roles
        user: {
            type: Schema.Types.ObjectId,
            ref: 'UserOwner',
            required: true,
            unique: true,
            role: {
                type: String,
                enum: [ 'ADMIN', 'MANAGER', 'STAFF'],
                required: true,
                default: 'STAFF'
            }
        },
        Branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: true,
            unique: true,
        },
       
         // --- Personal Information ---
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
        email: { type: String, required: true, unique: true },
        homeNumber: { type: String },
        physicalStats: {
            weightKg: Number,
            heightCm: Number,
        },

        // --- Professional Qualifications ---
        professionalQualifications: {
            certifications: [String ], // e.g., ["Certified Personal Trainer", "Group Fitness Instructor"]
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
                enum: ['Manager', 'Personal Trainer', 'Front Desk', 'Cleaner', 'Receptionist', 'Security Guard', 'Helper'] 
            },
            availability: {
                workDays: [String],
                preferredShift: String,
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
    }, 
    {
        timestamps: true,
    }
);


export const Employee = mongoose.model("Employee", employeesInGymSchema)
