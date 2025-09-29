const express = require('express');
const Doctor = require('../../models/doctors');
const DoctorDetailInfo = require('../../models/doctorDetailInfo');

// Get today's day
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const today = new Date();
const dayName = days[today.getDay()];
// console.log(dayName)

// get current time in HH:MM format
const currentHours = today.getHours().toString().padStart(2, '0');
const currentMinutes = today.getMinutes().toString().padStart(2, '0');
const currentTime = `${currentHours}:${currentMinutes}`
// console.log(currentTime);


// Helper function to calculate distance (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // km
  const toRad = (val) => (val * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return +(R * c).toFixed(2); // Distance in km
}


// Get all doctors with full info
// const getAllDoctors = async (req, res) => {
//     try {
//         const { lat, lng } = req.query; // optional

//         // 1. Find doctor IDs who work today
//         const workingDoctors = await Doctor.find({ workingDays: dayName }, '_id');

//         const doctorIds = workingDoctors.map(doc => doc._id);
//         console.log('doctorIds:', doctorIds)

//         // Fetch all doctor details with populated doctor info
//         const doctors = await DoctorDetailInfo.find({ doctorId: { $in: (doctorIds) }, status: 'approved' }).populate('doctorId');

//         // Format the response if needed
//         const fullDoctors = doctors.map(doc => ({
//             doctor: doc.doctorId,
//             details: {
//                 profilePhoto: doc.profilePhoto,
//                 degreeCertificate: doc.degreeCertificate,
//                 licenseCertificate: doc.licenseCertificate,
//                 registrationNumber: doc.registrationNumber,
//                 experience: doc.experience,
//                 bio: doc.bio,
//                 clinicAddress: doc.clinicAddress,
//                 clinicLocationURL: doc.clinicLocationURL,
//                 achievements: doc.achievements,
//                 clinicPhotos: doc.clinicPhotos,
//                 status: doc.status
//             }
//         }));

//         // If patient location + doctor location exist, calculate distance
//         if (
//             lat && lng &&
//             doc.doctorId.location?.lat &&
//             doc.doctorId.location?.lng
//         ) {
//             doctorData.distance = calculateDistance(
//                 parseFloat(lat),
//                 parseFloat(lng),
//                 doc.doctorId.location.lat,
//                 doc.doctorId.location.lng
//             );
//         } else {
//             doctorData.distance = null; // No location data
//         }

//         // 4. Sort by nearest if patient location provided
//         if (lat && lng) {
//             fullDoctors.sort((a, b) => {
//                 if (a.distance === null) return 1;
//                 if (b.distance === null) return -1;
//                 return a.distance - b.distance;
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: fullDoctors
//         });

//     } catch (err) {
//         console.error(err);
//         res.status(500).json({
//             success: false,
//             message: 'Server Error'
//         });
//     }
// };

const getAllDoctors = async (req, res) => {
  try {
    const { lat, lng } = req.query; // optional

    // 1. Find doctor IDs who work today
    const workingDoctors = await Doctor.find({ workingDays: dayName }, '_id');
    const doctorIds = workingDoctors.map(doc => doc._id);

    // 2. Fetch all doctor details with populated doctor info
    const doctors = await DoctorDetailInfo.find({
      doctorId: { $in: doctorIds },
      status: 'approved'
    }).populate('doctorId');

    // 3. Build response with optional distance
    const fullDoctors = doctors.map(doc => {
      const doctorData = {
        doctor: doc.doctorId,
        details: {
          profilePhoto: doc.profilePhoto,
          degreeCertificate: doc.degreeCertificate,
          licenseCertificate: doc.licenseCertificate,
          registrationNumber: doc.registrationNumber,
          experience: doc.experience,
          bio: doc.bio,
          clinicAddress: doc.clinicAddress,
          clinicLocationURL: doc.clinicLocationURL,
          achievements: doc.achievements,
          clinicPhotos: doc.clinicPhotos,
          status: doc.status
        },
        distance: null // default
      };

      // Get distance if patient location is given
      if (lat && lng && doc.clinicCoordinates?.coordinates?.length === 2) {
        const [doctorLng, doctorLat] = doc.clinicCoordinates.coordinates; // GeoJSON
        doctorData.distance = calculateDistance(
          parseFloat(lat),
          parseFloat(lng),
          doctorLat,
          doctorLng
        );
      }
      // console.log('Doctor:', doc.doctorId.name, 'Coords from DB:', doc.clinicCoordinates.coordinates);

      return doctorData;
    });

    // 4. Sort by nearest if patient location provided
    // Sort by nearest
    if (lat && lng) {
      fullDoctors.sort((a, b) => {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      });
    }
    // console.log("Patient location from query:", lat, lng);

    res.status(200).json({
      success: true,
      data: fullDoctors
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};


module.exports = { getAllDoctors };
