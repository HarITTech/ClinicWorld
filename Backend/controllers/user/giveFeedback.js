const Doctor = require('../../models/doctors');

const giveFeedback = async (req, res) => {
    const { doctorId, userId, patientName, rating, comment } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found."
            });
        }

        // Check if feedback already exists
        const alreadyGiven = doctor.feedbacks.some(
            (fb) => fb.userId.toString() === userId
        );

        if (alreadyGiven) {
            return res.status(400).json({
                success: false,
                message: "You have already submitted feedback for this doctor."
            });
        }

        // Add feedback
        const feedback = { userId, patientName, rating, comment };
        doctor.feedbacks.push(feedback);

        // ✅ Recalculate averageRating
        const ratings = doctor.feedbacks.map(fb => Number(fb.rating)); // Ensure rating is a number
        const total = ratings.reduce((sum, r) => sum + r, 0);
        const avg = total / ratings.length;

        doctor.averageRating = parseFloat(avg.toFixed(1)); // rounded to 1 decimal

        await doctor.save();

        return res.status(200).json({
            success: true,
            message: "Feedback submitted successfully.",
            averageRating: doctor.averageRating
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { giveFeedback };
