const Doctors = require('../../models/doctors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const login = async(req, res)=>{

    try {
        const {email, password } = req.body;
        const isExist = await Doctors.findOne({email});
        if(!isExist){
            return res.status(404).json({
                seccess: false,
                message: 'Email not found, please register first'
            })
        }

        const passMatch = await bcrypt.compare(password, isExist.password);;
        if(!passMatch){
            return res.status(400).json({
                success: false,
                message: 'Incorrect password, please try again or reset your password'
            })
        }
        const token = jwt.sign(
            { id: isExist._id, name: isExist.name, email: isExist.email, phone: isExist.mobile },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: isExist,
            token: token
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { login };