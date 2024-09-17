import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        default : false
    }

},
    {
    timestamps : true
    }
)

export const Users = mongoose.model('User', userSchema);

