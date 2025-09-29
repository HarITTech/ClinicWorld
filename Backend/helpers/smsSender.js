const twilio = require('twilio');
require('dotenv').config();

const client = new twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phone, message) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        console.log(`SMS sent to ${phone}`);
    } catch (err) {
        console.error('SMS error:', err.message);
    }
};

// module.exports = sendSMS;