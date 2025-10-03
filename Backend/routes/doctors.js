const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadFiles');
const { newRegistration } = require('../controllers/doctors/registration');
const { login } = require('../controllers/doctors/login');
const { changePassword } = require('../controllers/doctors/changePass');
const { uploadDoctorDetails } = require('../controllers/doctors/additinalInfo');
const { getAllDoctors } = require('../controllers/doctors/getAllDoctorsFullInfo')
const { editProfileInfo } = require('../controllers/doctors/editProfileInfo');
const { getTodaysAppointments } = require('../controllers/doctors/getTodaysAppointments');
const { getMyProfile } = require('../controllers/doctors/myProfile');
const { updateStatus } = require('../controllers/doctors/updatePatient');
const { getCompletedAppts } = require('../controllers/doctors/getCompletedAppts')
const { getNotCheckAppts } = require('../controllers/doctors/getNotCkeckAppts');
const { getSingleAppt } = require('../controllers/doctors/getSingleAppts');
const { getOldCompletedAppts, getOldNotCheckAppts } = require('../controllers/doctors/getOldAppts');
const { searchCompletedAppts } = require('../controllers/doctors/searchCompletedAppts');
const { getOnlyAllDoctors } = require('../controllers/doctors/getAllDoctors');
const { getDetailDoctorInfo } = require('../controllers/doctors/getDetailDoctorInfo');
const { toggleClinic } = require('../controllers/doctors/toggleClinic');
const { getBarGraphData } = require('../controllers/doctors/barGraph');
const { getPieGraphData } = require('../controllers/doctors/pieGraph');
const verifyToken = require('../middlewares/authMiddleware');
const { createSubscription, verifyPayment } = require('../controllers/doctors/createSubscription');
const { bookAppointmentForPatinet } = require('../controllers/doctors/bookAppointmentsForUser');

// Doctor registration
router.post('/register', newRegistration);

// Doctor login
router.post('/login', login);

// Change password
router.put('/change-password/:id', changePassword)

// Upload doctor details
router.post(
    '/upload-doctor-details/:doctorId',
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'degreeCertificate', maxCount: 1 },
        { name: 'licenseCertificate', maxCount: 1 },
        { name: 'achievements', maxCount: 5 },
        { name: 'clinicPhotos', maxCount: 5 },
    ]),
    uploadDoctorDetails
);

// Edit doctor profile info
router.put(
    '/update-doctor-profile/:doctorId',
    upload.fields([
        { name: 'profilePhoto', maxCount: 1 },
        { name: 'degreeCertificate', maxCount: 1 },
        { name: 'licenseCertificate', maxCount: 1 },
        { name: 'achievements', maxCount: 5 },
        { name: 'clinicPhotos', maxCount: 5 },
    ]),
    editProfileInfo
);

// get all doctors
router.get('/get-only-all-doctors', getOnlyAllDoctors)

// Get doctor info
router.get('/doctor-detail-info/:doctorId', getDetailDoctorInfo)

// Get todays Appointments
router.get('/get-todays-appointments/:doctorId', getTodaysAppointments)

// Get completed appointments
router.get('/get-completed-appointments/:doctorId', getCompletedAppts)

// Get not check appointments
router.get('/get-not-check-appointments/:doctorId', getNotCheckAppts)

// Get doctor profile info
router.get('/my-profile/:doctorId', verifyToken, getMyProfile)

// Get all doctors
router.get('/get-all-doctors', getAllDoctors)

// Update patient status
router.put('/update-patient-status/:doctorId/:appointmentId', updateStatus)

// Get patient single appointment
router.get('/get-patient-appointment/:doctorId/:appointmentId', getSingleAppt)

// Get old completed appointments
router.get('/get-old-completed-appointments/:doctorId', getOldCompletedAppts)

// Get old not check appointments
router.get('/get-old-notcheck-appointments/:doctorId', getOldNotCheckAppts)

// Get old Comlpeted appts by searching
router.get('/search-completed-appointments/:doctorId/:searchQuery', searchCompletedAppts)

// Open or close clinic
router.put('/toggle-clinic/:doctorId', toggleClinic);

// Get Bar data
router.get('/get-bar-data/:doctorId', getBarGraphData)

// Get Pie data
router.get('/get-pie-data/:doctorId', getPieGraphData)

// create subscription
router.post('/create-subscription', createSubscription);

// verify payment
router.post('/verify-payment', verifyPayment);

// Book appointments for patients by doctor
router.post('/book-appointment-for-patinet', bookAppointmentForPatinet)

module.exports = router;