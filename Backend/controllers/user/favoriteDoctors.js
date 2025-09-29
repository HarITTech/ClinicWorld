const User = require('../../models/userRegistration');

const addFavoriteDoctor = async (req, res) => {
    const { userId, doctorId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        if (!doctorId) {
            return res.status(404).json({
                success: false,
                message: "Doctor id require."
            })
        }

        if (user.favoriteDoctors.includes(doctorId)) {
            return res.status(404).json({
                success: false,
                message: "Doctor already in favorites."
            })
        }

        user.favoriteDoctors.push(doctorId);
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Doctor added to favorite."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFavoriteDoctor = async (req, res) => {
    const { userId, doctorId } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        user.favoriteDoctors = user.favoriteDoctors.filter(id => id.toString() !== doctorId)
        await user.save()

        return res.status(200).json({
            success: true,
            message: "Doctor remove from favorite."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getFavoriteDoctors = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('favoriteDoctors');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        }

        return res.status(200).json({
            success: true,
            doctors: user.favoriteDoctors
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { addFavoriteDoctor, removeFavoriteDoctor, getFavoriteDoctors }