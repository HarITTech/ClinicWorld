const cron = require("node-cron");
const Subscription = require('../models/subscription');
const DoctorDetailInfo = require('../models/doctorDetailInfo');

function StartCron() {
    console.log("Cron is running...");
    cron.schedule("* * * * *", async () => {  // runs every minute for testing
        try {
            const now = new Date();
            const expired = await Subscription.find({ endDate: { $lt: now }, status: 'active' });

            for (let sub of expired) {
                console.log("Subscription doctorId:", sub.doctorId, "EndDate:", sub.endDate);

                // expire subscription
                await Subscription.findByIdAndUpdate(sub._id, { status: 'expired' });

                // update DoctorDetailInfo based on doctorId field
                const doctor = await DoctorDetailInfo.findOneAndUpdate(
                    { doctorId: sub.doctorId },
                    { status: 'inactive' },
                    { new: true }
                );

                if (!doctor) console.log("DoctorDetailInfo not found for doctorId:", sub.doctorId);
                else console.log("Updated doctor status:", doctor.status);
            }

            console.log("Expired subscriptions updated");
        } catch (err) {
            console.error("Cron job error:", err);
        }
    });
}

module.exports = StartCron;
