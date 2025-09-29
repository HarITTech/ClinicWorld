const Users = require('../../models/userRegistration');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userRegister = async (req, res) => {
    const { fullName, mobile, email, password, confirmPassword } = req.body;
    try {
        const isUser = await Users.findOne({ email });
        if (isUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email is already exists.'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Password and confirm password do not match.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new Users({
            fullName,
            mobile,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword // Store hashed password for confirmPassword as well
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: 'User registered successfully',
            newUser: {
                Name: newUser.fullName,
                mobile: newUser.mobile,
                email: newUser.email,
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const userLogIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found, please do registration'
            });
        }

        const passMatch = await bcrypt.compare(password, user.password);
        if (!passMatch) {
            return res.status(400).json({
                success: false,
                message: 'Wrong password, please try again'
            });
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email, phone: user.mobile },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successfully.',
            user: user,
            token: token
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        return res.status(200).json({
            success: true,
            message: 'All users fetched successfully',
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getUserProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const User = await Users.findById(userId);
        if (!User) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        return res.status(200).json({
            success: true,
            User: User
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { fullName, mobile, email } = req.body;
    try {
        const User = await Users.findById(userId);
        if(!User){
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }
        if(fullName) User.fullName = fullName;
        if(mobile) User.mobile = mobile;
        if(email) User.email = email;

        await User.save();
        return res.status(200).json({
            success: true,
            message: "User profile updated successfully.",
            User: User
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { userRegister, userLogIn, getAllUsers, getUserProfile, updateProfile };









// const Users = require('../../models/userRegistration');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken')

// const userRegister = async (req, res) => {
//     const { fullName, mobile, email, password, confirmPassword } = req.body;
//     try {
//         const isUser = await Users.findOne({ email });
//         if (isUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User with this email is already exists.'
//             });
//         }

//         if (password !== confirmPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Password and confirm password do not match.'
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const newUser = new Users({
//             fullName,
//             mobile,
//             email,
//             password: hashedPassword,
//             confirmPassword: hashedPassword // Store hashed password for confirmPassword as well
//         });

//         await newUser.save();

//         return res.status(201).json({
//             success: true,
//             message: 'User registered successfully',
//             newUser: {
//                 Name: newUser.fullName,
//                 mobile: newUser.mobile,
//                 email: newUser.email,
//             }
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// const userLogIn = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const user = await Users.findOne({ email });
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'User not found, please do registration'
//             });
//         }

//         const passMatch = await bcrypt.compare(password, user.password);
//         if (!passMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Wrong password, please try again'
//             });
//         }

//         const token = jwt.sign(
//             { id: user._id, name: user.name, email: user.email, phone: user.mobile },
//             process.env.JWT_SECRET,
//             { expiresIn: '2h' }
//         );

//         return res.status(200).json({
//             success: true,
//             message: 'Login successfully.',
//             user: user,
//             token: token
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await Users.find();
//         return res.status(200).json({
//             success: true,
//             message: 'All users fetched successfully',
//             users
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// }

// const getUserProfile = async (req, res) => {
//     const userId = req.params.id;
//     try {
//         const User = await Users.findById(userId);
//         if (!User) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             })
//         }
//         return res.status(200).json({
//             success: true,
//             User: User
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// const updateProfile = async (req, res) => {
//     const userId = req.params.id;
//     const { fullName, mobile, email } = req.body;
//     try {
//         const User = await Users.findById(userId);
//         if(!User){
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             })
//         }
//         if(fullName) User.fullName = fullName;
//         if(mobile) User.mobile = mobile;
//         if(email) User.email = email;

//         await User.save();
//         return res.status(200).json({
//             success: true,
//             message: "User profile updated successfully.",
//             User: User
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

// module.exports = { userRegister, userLogIn, getAllUsers, getUserProfile, updateProfile };