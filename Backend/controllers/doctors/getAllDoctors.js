const Doctor = require('../../models/doctors');

const getOnlyAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();

        return res.status(200).json({
            success: true,
            doctors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors.',
            error: error.message,
        });
    }
};

module.exports = { getOnlyAllDoctors };
