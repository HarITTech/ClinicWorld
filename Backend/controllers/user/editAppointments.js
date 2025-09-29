const Doctor = require('../../models/doctors');

const editAppointment = async (req, res) => {
  const { doctorId, appointmentId } = req.params;
  const { patientName, patientAge, patientProblem } = req.body;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const appointment = doctor.appointments.id(appointmentId);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (patientName) appointment.patientName = patientName;
    if (patientAge) appointment.patientAge = patientAge;
    if (patientProblem) appointment.patientProblem = patientProblem;

    await doctor.save();

    return res.status(200).json({ success: true, message: 'Appointment updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { editAppointment };
