// helpers/autoDeleteExpiredAppointments.js
const cron = require('node-cron');
const Doctor = require('../models/doctors');

const autoDeleteExpiredAppointments = () => {
    console.log("[CRON] Auto delete scheduler initialized...");

    cron.schedule('0 0 * * *', async () => { // 🔁 Runs every day at midnight
        try {
            const today = new Date().toISOString().split('T')[0];
            console.log(`[CRON] Cleaning up expired appointments before ${today}`);

            // Convert `today` to a real Date (at midnight)
            const todayDate = new Date();
            todayDate.setUTCHours(0, 0, 0, 0);

            // Remove all appointments whose `appointmentDate` (Date type) is less than today
            const result = await Doctor.updateMany(
                {},
                { $pull: { appointments: { appointmentDate: { $lt: todayDate } } } }
            );

            const doctorsBefore = await Doctor.find({ "appointments.appointmentDate": { $lt: today } });
            console.log(`Doctors with old appointments: ${doctorsBefore.length}`);

            doctorsBefore.forEach(doc => {
                const expired = doc.appointments.filter(a => a.appointmentDate < today);
                console.log(`Doctor: ${doc._id}, Expired Appointments:`, expired);
            });

            console.log(`[CRON] Cleanup complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
        } catch (error) {
            console.error('[CRON] Error during appointment cleanup:', error.message);
        }
    });
};

module.exports = { autoDeleteExpiredAppointments };
