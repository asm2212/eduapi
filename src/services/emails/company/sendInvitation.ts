import logger from '../../../utils/logger';
import transporter from '../emailTransporter';
import { convert } from 'html-to-text';

const sendInvitationMail = async ({ fullName, email, password }: { fullName: string; email: string; password: string }) => {
    try {
        const html = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EDU Invitation</title>
    <style>
        body {
            font-family: sans-serif;
            background-color: #f9f9f9;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: 100vh;
        }
        .container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
        }
        .email-container {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            max-width: 400px;
            width: 100%;
            padding: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: left;
        }
        .email-container h1 {
            font-size: 24px;  /* Slightly larger heading */
            color: #333333;
            margin-bottom: 10px; /* Added some margin */
        }
        .email-container h2 {
            font-size: 20px;
            color: #333333;
            margin-bottom: 5px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e0e0e0;
        }
        .email-container p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 15px; /* Adjusted margin */
        }
        .email-container .button {
            display: inline-block;
            background-color: #000;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            transition: 0.2s all ease-in-out;
        }
        .email-container .button:hover {
            background-color: #0056b3;
        }
        .email-container .footer {
            padding-bottom: 10px;
            border-top: 1px solid #e0e0e0;
            margin-top: 20px;
            font-size: 12px;
            color: #999999;
        }
        .email-container .footer a {
            color: #666666;
            text-decoration: none;
        }
        .email-container .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-container">
            <h1>EDU Invitation</h1>
            <h2>Welcome to Edu, ${fullName}!</h2>
            <p>You have been invited to join our EDU. To get started, please use the following credentials:</p>
            <p>
                <strong>Email:</strong> ${email}<br>
                <strong>Password:</strong> ${password}  <br> <span style="font-size:12px; color:red;">(Please change your password after first login)</span>
            </p>
            <p>Click the button below to log in and begin exploring the Edu:</p>
            <a href="[loginLink]" target="_blank" class="button">Log in to LMS</a>
            <div class="footer">
                <p>Edu &nbsp;| <a href="#">3alearningsolutions.com</a></p>
            </div>
        </div>
    </div>
</body>
</html>`;
        const mailOptions = {
            from: `"3a Edu" noreplyasmareadmasu0@gmail.com" `,
            to: email,
            subject: `Credential Details - LMS`,
            text: convert(html),
            html: html
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error(`Error while verification mail:`, error);
    }
};

export default sendInvitationMail;
