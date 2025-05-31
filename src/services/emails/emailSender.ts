import logger from '../../utils/logger';
import transporter from './emailTransporter';
import forgetPasswordHtml from './templates/forgotPassword';
import emailVerificationHtml from './templates/verficationCode';

const { convert } = require('html-to-text');

export const sendVerificationMail = async () => {
    try {
        const mailOptions = {
            from: `"Edu" asmareadmasu0@gmail.com.com" `,
            to: `asmadm2212@gmail.com`,
            subject: `Verify Your Email - edu`,
            text: convert(emailVerificationHtml),
            html: emailVerificationHtml
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error('Error sending verification email:', error);
        // Handle errors gracefully, e.g., retry or notify admins
    }
};

export const sendForgetPasswordMail = async () => {
    try {
        const mailOptions = {
            from: `"Edu" asmareadmasu0@gmail.com.com" `,
            to: `asmadm2212@gmail.com`,
            subject: `Forget Password Link - Edu`,
            text: convert(forgetPasswordHtml),
            html: forgetPasswordHtml
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error('Error sending forget password email:', error);
        // Handle errors gracefully, e.g., retry or notify admins
    }
};
