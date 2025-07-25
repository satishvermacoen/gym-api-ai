import mongoose, {Schema} from "mongoose";


const membersInGymSchema = new Schema(
    {
        // --- Personal Information ---
        image: {
            type: String,
            require: false
        },
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
        alternateMobile: {
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
            classInterests:{
                type: String,
                enum: ["Zumba", "Pilates", "Barre", "Yoga", "HIIT", "Weight Loss", "Weight Training"],
                required: true,
                default: ["Weight Training"],

            }, 
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
                enum: ['Credit Card', 'Debit Card', 'UPI', 'Cash', 'Net Banking','Friend Banking']
            },
            paidAmount: Number,
            receivableAmount: Number,
            dueDate: Date
        },

        // --- System & Branch Information ---
        branch: {
            type: Schema.Types.ObjectId,
            ref: 'Branch',
            required: [true, 'Member must be associated with a branch.'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'UserOwner',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'UserOwner',
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