const Doctors = require('../../models/doctors')
const DoctorFullInfo = require('../../models/doctorDetailInfo')

const getMyProfile = async(req, res)=>{
    const doctorId = req.params.doctorId;
    try {
        const myProfile = await DoctorFullInfo.findOne({doctorId}).populate('doctorId')

        if(!myProfile){
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            })
        }

        const profileInfo = {
            name: myProfile.doctorId.name,
            phone: myProfile.doctorId.phone,
            specialization: myProfile.doctorId.specialization,
            isClinicOpen: myProfile.doctorId.isClinicOpen,
            workingDays: myProfile.doctorId.workingDays,
            startTime: myProfile.doctorId.startTime,
            endTime: myProfile.doctorId.endTime,
            maxTokensPerDay: myProfile.doctorId.maxTokensPerDay,
            profilePhoto: myProfile.profilePhoto,
            licenseCertificate: myProfile.licenseCertificate,
            degreeCertificate: myProfile.degreeCertificate,
            experience: myProfile.experience,
            bio: myProfile.bio,
            clinicAddress: myProfile.clinicAddress,
            clinicLocationURL: myProfile.clinicLocationURL,
            achievements: myProfile.achievements,
            clinicPhotos: myProfile.clinicPhotos
        }

        return res.status(200).json({
            success: true,
            myProfile: profileInfo
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {getMyProfile}
