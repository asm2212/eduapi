import { convert } from 'html-to-text';
import logger from '../../../utils/logger';
import transporter from '../emailTransporter';

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset password | EDU</title>
    <style>
    body {
            font-family: sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
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
        .email-container img {
            width: 40px;
            height: 40px;
            margin-bottom: 20px;
        }
        .email-container h2 {
            font-size: 20px;
            color: #333333;
            margin-bottom: 5px;
      padding-bottom:10px;
      border-bottom:1px solid #e0e0e0;
        }
        .email-container p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 20px;
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
        }
        .email-container .button:hover {
            background-color: #0056b3;
        }
        .email-container .footer {
      padding-bottom:10px;
      border-top:1px solid #e0e0e0;
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
       <h1>Edu</h1>
    <h2>Reset Your Password</h2>
    <p>
      We received a request to reset your password for your Edu account.
      If you didn't request a password reset, you can safely ignore this email.
    </p>
    <p>
      To create a new password, please click the button below. This link will
      expire in 48 hours for security reasons.
    </p>
    <a href="#" class="button">Reset Your Password</a>
    <div class="footer">
      <p>
        Edu &nbsp;| <a href="#">3alearningsolutions.com</a>
      </p>
    </div>
    </div>
</body>
</html>`;

const forgetPasswordMail = async () => {
    try {
        const mailOptions = {
            from: `"3a Edu" asmadm@gmail.com.com" `,
            to: `asmareamdasu0@gmail.com@gmail.com`,
            subject: `Reset Password - edu`,
            text: convert(html),
            html: html
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error(`Error while forget password mail:`, error);
    }
};

export default forgetPasswordMail;

