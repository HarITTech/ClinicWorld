const express = require('express');
const router = express.Router();
const UpdateStatus = require('../controllers/admin/updateDoctorStatus');

router.put('/update-doctor-status/:doctorId', UpdateStatus.updateStatus);

module.exports = router;