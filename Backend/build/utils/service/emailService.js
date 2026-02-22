"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRegistrationEmail = exports.sendEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const wistonLogger_1 = __importDefault(require("../../loggers/wistonLogger"));
const config_1 = require("../../utils/config/config");
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config_1.config.emailUser,
        clientId: config_1.config.clientId,
        clientSecret: config_1.config.clientSecret,
        refreshToken: config_1.config.refreshToken,
    },
});
// Verify the connection configuration
exports.transporter.verify((error, success) => {
    if (error) {
        wistonLogger_1.default.error('Error connecting to email server:', error);
    }
    else {
        wistonLogger_1.default.info('Email server is ready to send messages');
    }
});
// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await exports.transporter.sendMail({
            from: `"${config_1.config.emailUser}" <${config_1.config.emailUser}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });
        wistonLogger_1.default.info('Message sent: %s', info.messageId);
        wistonLogger_1.default.info('Preview URL: %s', nodemailer_1.default.getTestMessageUrl(info));
    }
    catch (error) {
        wistonLogger_1.default.error('Error sending email:', error);
    }
};
exports.sendEmail = sendEmail;
/**
 * Sends a styled registration welcome email to a new user.
 *
 * @param userEmail - The recipient's email address.
 * @param name - The name of the user.
 */
const sendRegistrationEmail = async (userEmail, name) => {
    const subject = "Welcome to our platform!";
    const text = `Hello ${name}, \n\nThank you for registering with our platform! We're excited to have you on board.`;
    const html = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 40px; background-color: #ffffff; border: 1px solid #f0f0f0; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
            <h1 style="color: #1a1a1a; font-size: 24px; font-weight: 600; margin-bottom: 24px; text-align: center;">Welcome, ${name}!</h1>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We're thrilled to have you join our community. Thank you for choosing to register with our platform!
            </p>
            <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                You can now access all our features and start exploring everything we have to offer. We're here to help you every step of the way.
            </p>
            <div style="border-top: 1px solid #eeeeee; padding-top: 25px; margin-top: 35px;">
                <p style="color: #888888; font-size: 14px; margin: 0;">Best regards,</p>
                <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin: 4px 0 0 0;">The Team</p>
            </div>
        </div>
    `;
    await (0, exports.sendEmail)(userEmail, subject, text, html);
};
exports.sendRegistrationEmail = sendRegistrationEmail;
