const mongoose = require('mongoose');

// Feedback sub-schema (optional to reuse/extend)
const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    patientName: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false, // Password is not required at registration, will be set later
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    specialization: {
        type: String,
        required: true
    },
    workingDays: {
        type: [String],
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    maxTokensPerDay: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    averageRating: {
        type: Number,
        default: 0
    },
    isClinicOpen: {
        type: Boolean,
        default: false
    },
    appointments: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Users',
            required: true
        },
        patientName: {
            type: String,
            required: true
        },
        patientAge: {
            type: Number,
            required: true
        },
        patientProblem: {
            type: String,
            required: false
        },
        bookingTime: {
            type: Date,
            default: Date.now
        },
        appointmentDate: {
            type: String, // Format: YYYY-MM-DD
            required: true
        },
        appointmentNumber: {
            type: Number,
            required: true
        },
        patientStatus: {
            type: String,
            enum: ['inProcess', 'completed', 'notCheck'],
            default: "inProcess"
        }
    }],

    feedbacks: [feedbackSchema]
});

module.exports = mongoose.model('Doctor', doctorSchema);