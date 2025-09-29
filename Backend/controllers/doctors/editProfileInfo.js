const Doctor = require('../../models/doctors')
const DoctorDetailInfo = require('../../models/doctorDetailInfo')
const path = require('path')
const extractCoordinatesFromURL = require('../../utils/extractCoordinatesFromURL');
const { uploadImage, uploadMultipleImages, uploadPDF } = require('../../utils/uploadImages');

const editProfileInfo = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const {
            name,
            phone,
            specialization,
            workingDays,
            startTime,
            endTime,
            maxTokensPerDay,
            address
        } = req.body;

        const isDoctor = await Doctor.findOne({ _id: doctorId });
        if (!isDoctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            })
        }

        if (name) isDoctor.name = name;
        if (phone) isDoctor.phone = phone;
        if (specialization) isDoctor.specialization = specialization;
        if (workingDays) isDoctor.workingDays = workingDays;
        if (startTime) isDoctor.startTime = startTime;
        if (endTime) isDoctor.endTime = endTime;
        if (maxTokensPerDay) isDoctor.maxTokensPerDay = maxTokensPerDay;
        if (address) isDoctor.address = address;

        await isDoctor.save();

        const fullInfo = await DoctorDetailInfo.findOne({ doctorId: doctorId })
        if (!fullInfo) {
            return res.status(404).json({
                success: false,
                message: 'Detailed profile not found'
            });
        }

        const {
            registrationNumber,
            experience,
            bio,
            street,
            city,
            state,
            pinCode,
            clinicLocationURL
        } = req.body;

        if (registrationNumber) fullInfo.registrationNumber = registrationNumber
        if (experience) fullInfo.experience = experience
        if (bio) fullInfo.bio = bio
        if (street) fullInfo.clinicAddress.street = street;
        if (city) fullInfo.clinicAddress.city = city;
        if (state) fullInfo.clinicAddress.state = state;
        if (pinCode) fullInfo.clinicAddress.pinCode = pinCode;
        // if (clinicLocationURL) fullInfo.clinicLocationURL = clinicLocationURL
        if (clinicLocationURL) {
            fullInfo.clinicLocationURL = clinicLocationURL;

            const coordinates = extractCoordinatesFromURL(clinicLocationURL);
            if (!coordinates) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid Google Maps URL. Could not extract coordinates.'
                });
            }

            fullInfo.clinicCoordinates = { type: "Point", coordinates };
        }

        // If files are uploaded
        // const files = req.files;

        // if (files?.profilePhoto) fullInfo.profilePhoto = files.profilePhoto[0].path;
        // if (files?.degreeCertificate) fullInfo.degreeCertificate = files.degreeCertificate[0].path;
        // if (files?.licenseCertificate) fullInfo.licenseCertificate = files.licenseCertificate[0].path;
        // if (files?.achievements) fullInfo.achievements = files.achievements.map(file => file.path);
        // if (files?.clinicPhotos) fullInfo.clinicPhotos = files.clinicPhotos.map(file => file.path);


        // ✅ Handle file uploads (Cloudinary instead of local path)
        const files = req.files;

        if (files?.profilePhoto) {
            fullInfo.profilePhoto = await uploadImage(files.profilePhoto[0], "doctors/profilePhotos");
        }

        if (files?.degreeCertificate) {
            fullInfo.degreeCertificate = await uploadPDF(files.degreeCertificate[0], "doctors/degreeCertificates");
        }

        if (files?.licenseCertificate) {
            fullInfo.licenseCertificate = await uploadPDF(files.licenseCertificate[0], "doctors/licenseCertificates");
        }

        if (files?.achievements) {
            fullInfo.achievements = await Promise.all(
                // Call uploadImage for EACH file in the array
                files.achievements.map(file => uploadImage(file, "doctors/achievements"))
            );
        }

        if (files?.clinicPhotos) {
            fullInfo.clinicPhotos = await Promise.all(
                // Call uploadImage for EACH file in the array
                files.clinicPhotos.map(file => uploadImage(file, "doctors/clinicPhotos"))
            );
        }


        await fullInfo.save();
        return res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            doctor: isDoctor,
            fullInfo: fullInfo
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

module.exports = { editProfileInfo }