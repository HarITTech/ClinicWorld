const today = new Date().toISOString().split('T')[0];
// console.log(today)
const Doctor = require('../../models/doctors');

const bookAppointment = async (req, res) => {
    const { doctorId, userId, patientName, patientAge, patientProblem, patientStatus } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const today = new Date().toISOString().split('T')[0];

        // ✅ Count today's appointments for this doctor
        const todayAppointments = doctor.appointments.filter(
            (appt) => appt.appointmentDate === today
        );

        // Get the highest appointment number
        const maxAppointmentNumber = todayAppointments.reduce((max, appt) => {
            return appt.appointmentNumber > max ? appt.appointmentNumber : max;
        }, 0);

        if (todayAppointments.length >= doctor.maxTokensPerDay) {
            return res.status(400).json({ success: false, message: 'No more tokens available for today' });
        }

        const appointment = {
            userId,
            patientName,
            patientAge,
            patientProblem,
            appointmentDate: today,
            appointmentNumber: maxAppointmentNumber + 1,
            bookingTime: new Date(),
            patientStatus
        };

        // ✅ Push and save
        doctor.appointments.push(appointment);
        await doctor.save();

        return res.status(200).json({
            success: true,
            message: 'Appointment booked successfully',
            data: appointment
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { bookAppointment };
