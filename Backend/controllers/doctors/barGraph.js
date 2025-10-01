const Doctor = require('../../models/doctors');

const getBarGraphData = async (req, res) => {
    const { doctorId } = req.params;
    const today = new Date().toISOString().split('T')[0];
    // console.log(today);

    try {
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        const getOldSevenDaysData = doctor.appointments.filter(appt => {
            const appointmentDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
            return appointmentDate >= new Date(new Date(today).setDate(new Date(today).getDate() - 7)).toISOString().split('T')[0];
        })

        return res.status(200).json({
            success: true,
            barGraphData: getOldSevenDaysData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getBarGraphData };