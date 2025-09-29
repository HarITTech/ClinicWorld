const express = require('express');
const Subscription = require('../../models/subscription');
const DoctorDetailInfo = require('../../models/doctorDetailInfo');
const razorpay = require('../../razorpay');
const subscriptionPlans = require('../doctors/subscriptionPlans');

const createSubscription = async (req, res) => {
    try {
        const { doctorId, planType } = req.body;
        const plan = subscriptionPlans[planType];

        // console.log("Requested planType:", planType);
        // console.log("Available plans:", Object.keys(subscriptionPlans));

        if (!plan) return res.status(400).json({ error: "Invalid plan" });

        if (plan.amount === 0) {
            // ✅ Check if doctor has ever used free plan
            const existingFreePlan = await Subscription.findOne({
                doctorId,
                planType: 'free'
            });

            if (existingFreePlan) {
                return res.status(400).json({
                    error: "You have already used the free plan. Please choose a paid plan."
                });
            }

            // Free Plan logic
            const endDate = new Date();
            endDate.setMonth(endDate.getMonth() + plan.durationMonths);

            const subscription = new Subscription({
                doctorId,
                planType,
                amount: 0,
                endDate,
                status: 'active'
            });

            await subscription.save();

            // Update DoctorDetailInfo
            const doctor = await DoctorDetailInfo.findOneAndUpdate(
                { doctorId },
                { status: 'approved' },
                { new: true }
            );

            if (!doctor) console.log("DoctorDetailInfo not found for doctorId:", doctorId);
            // else console.log("Updated doctor status:", doctor.status);

            return res.json({ success: true, subscription });
        }

        // Paid Plan: Create Razorpay Order
        const options = {
            amount: plan.amount * 100, // Razorpay uses paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        console.error("Razorpay order creation failed:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { doctorId, planType, paymentId } = req.body;
        const plan = subscriptionPlans[planType];
        if (!plan) return res.status(400).json({ error: "Invalid plan" });

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationMonths);

        const subscription = new Subscription({
            doctorId,
            planType,
            amount: plan.amount,
            endDate,
            paymentId,
            status: 'active'
        });

        await subscription.save();

        // Update DoctorDetailInfo
        const doctor = await DoctorDetailInfo.findOneAndUpdate(
            { doctorId },
            { status: 'approved' },
            { new: true }
        );

        // console.log("DoctorDetailInfo update result:", doctor);

        if (!doctor) console.log("DoctorDetailInfo not found for doctorId:", doctorId);
        else console.log("Updated doctor status:", doctor.status);

        res.json({ success: true, subscription });
    } catch (err) {
        console.error("Payment verification failed:", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
};

module.exports = { createSubscription, verifyPayment };
