import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    room: {
        type: String,
        required: true,
    },
    roomid: {
        type: String,
        required: true,
    },
    userid: {
        type: String,
        required: true,
    },
    fromdate: {
        type: String,
        required: true,
    },
    todate: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    totalDays: {
        type: Number,
        required: true,
    },
    transitionId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'booked',
    },
}, {
    timestamps: true,
});

export const Bookings = mongoose.model('Booking', bookingSchema);
