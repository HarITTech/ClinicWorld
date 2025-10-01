const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const UserRegistration = require('../controllers/user/registration');
const changePass = require('../controllers/user/changePassword');
const bookAppointment = require('../controllers/user/bookAppointment');
const getMyAppointments= require('../controllers/user/myAppointments');
const getOldAppointments = require('../controllers/user/getOldAppointments')
const editAppointments = require('../controllers/user/editAppointments')
const favoriteDoctors = require('../controllers/user/favoriteDoctors');
const cancelAppointment = require('../controllers/user/cancelAppointment');
const giveFeedback = require('../controllers/user/giveFeedback');

router.post('/user-registration', UserRegistration.userRegister);
router.post('/user-login', UserRegistration.userLogIn);
router.get('/all-users', UserRegistration.getAllUsers);
router.put('/change-password/:id', verifyToken, changePass.changePass);
router.post('/book-appointment', verifyToken, bookAppointment.bookAppointment);
router.delete('/cancel-appointment/:doctorId/:appointmentId', verifyToken, cancelAppointment.cancelAppointment)
router.get('/get-my-appointments/:userId', verifyToken, getMyAppointments.getMyAppointments);
router.get('/get-user-profile/:id', verifyToken, UserRegistration.getUserProfile);
router.put('/update-profile/:id', verifyToken, UserRegistration.updateProfile);
router.get('/my-old-appointments/:userId', verifyToken, getOldAppointments.getOldAppointments);
router.put('/edit-appointment/:doctorId/:appointmentId', verifyToken, editAppointments.editAppointment);
router.post('/add-favorite', favoriteDoctors.addFavoriteDoctor);
router.post('/remove-favorite', favoriteDoctors.removeFavoriteDoctor);
router.get('/get-favorites/:userId', favoriteDoctors.getFavoriteDoctors);
router.post('/give-feedback', giveFeedback.giveFeedback);

module.exports = router;