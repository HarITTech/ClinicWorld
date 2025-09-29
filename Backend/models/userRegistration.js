const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true
    },
    mobile:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPassword:{
        type: String,
        required: true
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    favoriteDoctors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor'
    }]
});

module.exports = mongoose.model('UserRegistration', userRegistrationSchema);


// const mongoose = require('mongoose');

// const userRegistrationSchema = new mongoose.Schema({
//     fullName:{
//         type: String,
//         required: true
//     },
//     mobile:{
//         type: String,
//         required: true,
//     },
//     email:{
//         type: String,
//         required: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     confirmPassword:{
//         type: String,
//         required: true
//     },
//     favoriteDoctors: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Doctor'
//     }]
// });

// module.exports = mongoose.model('UserRegistration', userRegistrationSchema);