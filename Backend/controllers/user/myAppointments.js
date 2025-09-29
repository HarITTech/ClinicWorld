const Doctors = require('../../models/doctors')
const User = require('../../models/userRegistration')

const getMyAppointments = async (req, res) => {
    const userId = req.params.userId

    try {
        const isUser = await User.findById(userId)
        if (!isUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const allDoctors = await Doctors.find()
        const userAppointments = []

        const today = new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'})

        for (let doctor of allDoctors) {
            const appointment = doctor.appointments
            for (let appt of appointment) {
                const apptDate = new Date(appt.appointmentDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })

                if ((appt.userId?.toString() === userId) && (apptDate === today)) {
                    userAppointments.push({
                        appt,
                        doctorId: doctor._id,
                        name: doctor.name,
                        specialization: doctor.specialization,
                        phone: doctor.phone
                    })
                }
            }
        }

        return res.status(200).json({
            success: true,
            userAppointments
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getMyAppointments }