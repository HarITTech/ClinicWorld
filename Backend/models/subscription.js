const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    planType: {
        type: String,
        enum: ['free', '6_months', '12_months'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    },
    paymentId: {
        type: String, // Razorpay payment ID
        required: function() {
            return this.planType !== 'free';
        }
    },
    status: {
        type: String,
        enum: ['active', 'expired'],
        default: 'active'
    }
});

// Automatically expire when endDate passes
subscriptionSchema.methods.isActive = function() {
    return this.status === 'active' && new Date() <= this.endDate;
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
