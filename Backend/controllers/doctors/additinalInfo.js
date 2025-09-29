const DoctorDetailInfo = require('../../models/doctorDetailInfo')
const Doctor = require('../../models/doctors');
const extractCoordinatesFromURL = require('../../utils/extractCoordinatesFromURL');
const { uploadImage, uploadMultipleImages, uploadPDF } = require('../../utils/uploadImages');

// Upload Doctor Detailed Profile
const uploadDoctorDetails = async (req, res) => {
    try {
        const { doctorId } = req.params;

        // Prevent duplicate profile
        const alreadyExists = await DoctorDetailInfo.findOne({ doctorId });

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                message: "Profile already completed for this doctor."
            });
        }

        const {
            registrationNumber,
            experience,
            bio,
            clinicAddress,
            clinicLocationURL
        } = req.body;

        // Validate required body fields
        if (!registrationNumber || !experience || !bio || !clinicLocationURL) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be filled.'
            });
        }

        if (!clinicAddress?.street || !clinicAddress?.city || !clinicAddress?.state || !clinicAddress?.pinCode) {
            return res.status(400).json({
                success: false,
                message: 'Complete clinic address is required.'
            });
        }

        // Validate files
        const files = req.files;
        if (!files || !files.profilePhoto || !files.degreeCertificate || !files.licenseCertificate) {
            return res.status(400).json({
                success: false,
                message: 'Profile photo, degree certificate, and license certificate are required.'
            });
        }

        // Extract file paths
        // const profilePhoto = files.profilePhoto[0].path;
        // const degreeCertificate = files.degreeCertificate[0].path;
        // const licenseCertificate = files.licenseCertificate[0].path;

        // const achievements = files.achievements?.map(file => file.path) || [];
        // const clinicPhotos = files.clinicPhotos?.map(file => file.path) || [];



        // ✅ Upload to Cloudinary
        const profilePhoto = await uploadImage(files.profilePhoto[0], "doctors/profilePhotos");
        const degreeCertificate = await uploadPDF(files.degreeCertificate[0], "doctors/degreeCertificates");
        const licenseCertificate = await uploadPDF(files.licenseCertificate[0], "doctors/licenseCertificates");

        const achievements = files.achievements
            ? await Promise.all(files.achievements.map(file => uploadMultipleImages(file, "doctors/achievements")))
            : [];

        const clinicPhotos = files.clinicPhotos
            ? await Promise.all(files.clinicPhotos.map(file => uploadMultipleImages(file, "doctors/clinicPhotos")))
            : [];

        // Check if registration number is already used
        const regExists = await DoctorDetailInfo.findOne({ registrationNumber });
        if (regExists) {
            return res.status(409).json({
                success: false,
                message: 'Registration number already exists. Please use a valid one.'
            });
        }

        // Extract coordinates from Google Maps URL
        const coordinates = extractCoordinatesFromURL(clinicLocationURL);
        if (!coordinates) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google Maps URL. Could not extract coordinates.'
            });
        }

        const doctorInfo = new DoctorDetailInfo({
            doctorId,
            profilePhoto,          // ✅ URL from Cloudinary
            degreeCertificate,     // ✅ URL
            licenseCertificate,    // ✅ URL
            registrationNumber,
            experience,
            bio,
            clinicAddress,
            clinicLocationURL,
            clinicCoordinates: { type: "Point", coordinates },
            achievements,          // ✅ Array of URLs
            clinicPhotos,          // ✅ Array of URLs
            status: 'pending'
        });

        await doctorInfo.save();

        return res.status(201).json({
            success: true,
            message: 'Doctor profile completed successfully.',
            data: doctorInfo
        });

    } catch (error) {
        console.error('Upload Doctor Details Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while saving doctor details.',
            error: error.message
        });
    }
};

module.exports = { uploadDoctorDetails };
