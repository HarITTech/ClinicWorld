const mongoose = require('mongoose');

const doctorDetailInfoSchema = new mongoose.Schema({
    doctorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    degreeCertificate:{
        type: String,
        required: true
    },
    licenseCertificate:{
        type: String,
        required: true
    },
    registrationNumber:{
        type: String,
        require: true,
        unique: true
    },
    experience: {
        type: Number,
        required: true,
    },
    bio:{
        type: String,
        required: true
    },
    clinicAddress: {
        street: {
            type: String,
            required: true,
            trim: true
        },
        city: {
            type: String,
            required: true,
            trim: true
        },
        state: {
            type: String,
            required: true
        },
        pinCode: {
            type: String,
            required: true,
            match: [/^\d{5,6}$/, 'Invalid postal code']
        },
        country: {
            type: String,
            enum: ['India'], // Extend as needed
            default: 'India'
        }
    },
    clinicLocationURL:{
        type: String,
        required: true
    },
    clinicCoordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    // Remaining are all optional fields
    achievements: [String],
    clinicPhotos: [String],
    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected', 'inactive'],
        default: 'pending'
    }
});

// Add geospatial index
doctorDetailInfoSchema.index({ clinicCoordinates: '2dsphere' });

module.exports = mongoose.model('DoctorDetailInfo', doctorDetailInfoSchema);