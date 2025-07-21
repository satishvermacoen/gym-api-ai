import mongoose, {Schema} from "mongoose";


const membersInGymSchema = new Schema(
    {
        // --- Personal Information ---
        firstName: {
            type: String,
            required: [true, 'First name is required.'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required.'],
            trim: true,
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required.'],
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
        },
        address: {
            street: String,
            city: String,
            state: String,
            pinCode: String,
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple null values, but unique if provided
            lowercase: true,
            trim: true,
        },
        mobileNumber: {
            type: String,
            required: [true, 'Mobile number is required.'],
            unique: true,
        },
        homeNumber: {
            type: String,
        },
        physicalStats: {
            weightKg: Number,
            heightCm: Number,
        },

        // --- Membership Preferences ---
        membership: {
            type: {
            type: String,
            enum: ['Basic', 'Premium', 'Family'],
            required: true,
            },
            duration: {
            type: String,
            enum: ['Monthly', 'Quarterly', 'Annually'],
            required: true,
            },
            preferredStartDate: Date,
            classInterests: [String], // e.g., ["Yoga", "HIIT", "Weight Loss"]
            specialRequests: String,
        },

        // --- Emergency Contact ---
        emergencyContact: {
            fullName: {
            type: String,
            required: [true, 'Emergency contact name is required.'],
            },
            relationship: String,
            mobileNumber: {
            type: String,
            required: [true, 'Emergency contact number is required.'],
            },
        },
        
        // --- Payment Information ---
        paymentDetails: {
            totalAmount: Number,
            paymentMode: {
                type: String,
                enum: ['Credit Card', 'Debit Card', 'UPI', 'Cash']
            },
            paidAmount: Number,
            receivableAmount: Number,
            dueDate: Date
        },

        // --- System & Branch Information ---
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Member must be associated with a branch.'],
        },
        // Link to the document/image of the physical form
        formImage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MemberImage'
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    }, 
    {
        timestamps: true,
    }   
    
);


export const membersInGym = mongoose.model("membersInGym", membersInGymSchema)