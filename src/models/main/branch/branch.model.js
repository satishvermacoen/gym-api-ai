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
            type: Schema.Types.ObjectId,
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
            coordinates: {
                type: [Number],
                require: false,
            },
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
                required: false,
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
            open: String, 
            close: String,
            isOpen: {
                type: Boolean,
                default: true
            }
        }],
        staff: [{
            type: Schema.Types.ObjectId,
            ref: 'employee',
        }],
    },
    {
        timestamps: true
    },       
);


export const Branch = mongoose.model("Branch", branchGymSchema)
