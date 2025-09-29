const DoctorInfo = require('../../models/doctorDetailInfo');

const updateStatus = async (req, res) => {
    const doctorId = req.params.doctorId;
    const { status } = req.body;

    try {
        const doctorInfo = await DoctorInfo.findOne({ doctorId });

        if (!doctorInfo) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.'
            });
        }

        // Prevent updating if status is already approved or rejected
        if (doctorInfo.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Doctor status is already updated.'
            });
        }

        // Allow only valid status updates
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Use approved or rejected.'
            });
        }

        // Update the status
        doctorInfo.status = status;
        await doctorInfo.save();

        return res.status(200).json({
            success: true,
            message: 'Doctor status updated successfully.'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { updateStatus };
