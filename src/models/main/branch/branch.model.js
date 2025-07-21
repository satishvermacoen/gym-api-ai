import mongoose, {Schema} from "mongoose";
import { userOwner } from "../users/user.owner.model";


const branchGymSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'A branch must have a name.'],
            trim: true,
            unique: false,
        },
        owner: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'UserOwner',
            required: [true, 'A branch must have an owner.'],
            }
        ],

        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point'],
            },
            coordinates: [Number], // [longitude, latitude]
            address: {
                type: String,
                required: [true, 'A branch must have an address.'],
            },
            city:{
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
                },
            pinCode:{
                type: Number,
                required: true,
                },
            country: {
                type: String,
                required: true,
            }
        },
        
        contact: {
            mobile: {
                type: String,
                required: true,
                default: userOwner.contactInfo.phone
                
            },
            phone: {
                type: String,
                required: true,
                },
            email: {
                type: String,
                required: true,
                default: userOwner.email
            },
        },
        operatingHours: [{
            day: {
                type: String,
                enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                required: true,
                default: 'Monday, Tuesday, Wednesday, Thursday, Friday, Saturday'
            },
            open: String, // e.g., "06:00"
            close: String, // e.g., "22:00"
            isOpen: {
                type: Boolean,
                default: true
            }
        }],
        amenities: [String], // e.g., ["Swimming Pool", "Sauna", "Free WiFi"]
        membershipPlans: [{
            name: String, // e.g., "Gold", "Silver"
            price: Number,
            durationInDays: Number,
            features: [String],
        }],
        staff: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
    },
    {
        timestamps: true
    },       
    
);


export const branchGym = mongoose.model("BranchGym", branchGymSchema)
