import logger from '../../../utils/logger';
import transporter from '../emailTransporter';
import { convert } from 'html-to-text';

const verificationCodeMail = async ({ verificationToken, email }: { verificationToken: string; email: string }) => {
    try {
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification | Edu</title>
            <style>
                body {
                    font-family: sans-serif;
                    background-color: #f9f9f9;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    height: 100vh;
                }
                    .container{
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
                    transition: 0.2s all ease-in-out;
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
        <div class="container">
            <div class="email-container">
        <!--         <img src="https://via.placeholder.com/40" alt="Company Logo"> -->
              <h1>LMS</h1>
            <h2>Verify Your Email Address</h2>
                <p>
              Thank you for signing up for Edu! To complete your account setup and
              start learning, please click the button below to confirm your email address.
            </p>
            <p>This verification link is valid for 48 hours.</p>
                <a href="http://localhost:2001/verify/${verificationToken}" target="_blank" class="button">Confirm Your Email</a>
                <div class="footer">
                    <p>Edu &nbsp;| <a href="#">3alearningsolutions.com</a></p>
                </div>
            </div>
            </div>
        </body>
        </html>`;
        const mailOptions = {
            from: `"3a Edu" noreply@asmadm2212@gmail.com.com" `,
            to: email,
            subject: `Verify Your Email -Edu`,
            text: convert(html),
            html: html
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error(`Error while verification mail:`, error);
    }
};
export default verificationCodeMail;
