const Doctor = require('../../models/doctors');

const toggleClinic = async( req, res ) => {
    const {doctorId} = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        doctor.isClinicOpen = !doctor.isClinicOpen;
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: `Clinic is now ${doctor.isClinicOpen ? 'open' : 'closed'}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { toggleClinic }