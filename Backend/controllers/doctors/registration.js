// const Doctors = require('../../models/doctors');
// const express = require('express');
// const bcrypt = require('bcryptjs');
// const { sendEmailOfUsernamePassword } = require('../../helpers/mailer');
// // const sendSMS = require('../../helpers/smsSender');

// function genratePassword(length = 8) {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let password = '';
//     for (let i = 0; i < length; i++) {
//         password += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return password;
// }

// const newRegistration = async (req, res) => {
//     const { name, email, phone, specialization, workingDays, startTime, endTime, maxTokensPerDay } = req.body;
//     try {
//         const existingDoctor = await Doctors.findOne({ email });
//         if (existingDoctor) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Doctor with this email already exists'
//             })
//         }

//         const password = genratePassword();
//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newDoctor = new Doctors({
//             name,
//             email,
//             phone,
//             specialization,
//             workingDays,
//             startTime,
//             endTime,
//             maxTokensPerDay,
//             // address,
//             password: hashedPassword
//         });

//         const doctor = await newDoctor.save();

//         await sendEmailOfUsernamePassword(email, password)
//         // await sendSMS(
//         //     phone,
//         //     `Hello Dr. ${name}, your MediQueue account has been created. Email: ${email}, Password: ${password}`
//         // );

//         return res.status(201).json({
//             success: true,
//             message: 'Doctor registered successfully',
//             newDoctor: doctor
//         })

//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// };

// module.exports = { newRegistration }

const Doctors = require('../../models/doctors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmailOfUsernamePassword } = require('../../helpers/mailer');

function generatePassword(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

const newRegistration = async (req, res) => {
    try {
        const { name, email, phone, specialization, workingDays, startTime, endTime, maxTokensPerDay } = req.body;

        // Check for existing doctor by email or phone
        const existingDoctor = await Doctors.findOne({ $or: [{ email }, { phone }] });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: 'Doctor with this email or phone already exists'
            });
        }

        // Generate temporary password
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create doctor record
        const newDoctor = new Doctors({
            name,
            email,
            phone,
            specialization,
            workingDays,
            startTime,
            endTime,
            maxTokensPerDay,
            password: hashedPassword
        });

        const doctor = await newDoctor.save();

        // Send credentials via email
        // await sendEmailOfUsernamePassword(newDoctor._id, email, password);
        // Create a token for change password link
        const token = jwt.sign(
            { doctorId: doctor._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // link valid for 1 hour
        );

        // Change password URL (Frontend route)
        const changePasswordLink = `http://localhost:4200/change-password/${token}`;

        // Send email with credentials + link
        await sendEmailOfUsernamePassword(email, password, changePasswordLink);

        return res.status(201).json({
            success: true,
            message: 'Doctor registered successfully',
            newDoctor: doctor
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = { newRegistration };
