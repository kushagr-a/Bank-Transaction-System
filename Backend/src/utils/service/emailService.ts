import nodemailer from 'nodemailer';
import logger from '../../loggers/wistonLogger';
import { config } from '../../utils/config/config';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: config.emailUser,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        logger.error('Error connecting to email server:', error);
    } else {
        logger.info('Email server is ready to send messages');
    }
});



// Function to send email
export const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"${config.emailUser}" <${config.emailUser}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        logger.info('Message sent: %s', info.messageId);
        logger.info('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        logger.error('Error sending email:', error);
    }
};

/**
 * Sends a styled registration welcome email to a new user.
 * 
 * @param userEmail - The recipient's email address.
 * @param name - The name of the user.
 */
export const sendRegistrationEmail = async (userEmail: string, name: string) => {
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

    await sendEmail(userEmail, subject, text, html);
};