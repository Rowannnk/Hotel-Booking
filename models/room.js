import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "maxpeople": {
        type: Number,
        required: true
    },
    "phonenumber": {
        type: Number,
        required: true
    },
    "rentperday": {
        type: Number,
        required: true
    },
    "imgurls": [],

    "currentbookings": [],

    "roomtype": {
        type: String,
        required: true,
        default : 'Suite'
    },
    "description": {
        type: String,
        required: true
    }
}, {
    "timestamps": true
});

export const Rooms = mongoose.model('Room', roomSchema);
