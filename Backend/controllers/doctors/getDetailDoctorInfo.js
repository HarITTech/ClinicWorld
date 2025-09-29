const DoctorFullInfo = require('../../models/doctorDetailInfo');

const getDetailDoctorInfo = async(req, res) => {
    const doctorId = req.params.doctorId;
    try {
        const doctorDetail = await DoctorFullInfo.findOne({doctorId});

        // if(!doctorDetail){
        //     return res.status(404).json({
        //         success: false,
        //         message: 'Doctor deatils not found.'
        //     })
        // }

        return res.status(200).json({
            success: true,
            doctorDetail
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getDetailDoctorInfo }