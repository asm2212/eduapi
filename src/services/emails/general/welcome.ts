import { convert } from 'html-to-text';
import transporter from '../emailTransporter';
import logger from '../../../utils/logger';
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Edu - [name]</title>
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
  <div class="email-container">
    <h1>Edu</h1>
    <h2>Welcome to Edu, [User Name]!</h2>
    <p>
      Thank you for verifying your email address and completing your Edu account setup.
      We're excited to have you on board!
    </p>
    <p>
      Edu offers a wide range of courses to help you learn and grow in your field.
      Explore our course catalog, find topics that interest you, and start learning
      at your own pace.
    </p>
    <p>Here are some helpful resources to get you started:</p>
    <ul>
      <li><a href="#">Browse Courses</a></li>
      <li><a href="#">Search for Specific Topics</a></li>
      <li><a href="#">Learn About Edu Features</a></li>
    </ul>
    <p>
      We're here to support you on your learning journey. If you have any questions,
      don't hesitate to contact our support team at <a href="mailto:support@lms.com">support@lms.com</a>.
    </p>
    <div class="footer">
      <p>
        LMS &nbsp;| <a href="#">3alearningsolutions.com</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

const welcomeMail = async () => {
    try {
        const mailOptions = {
            from: `"3a Edu" asmareadmasu0@gmail.com.com" `,
            to: `asmareadmasu0@gmail.com`,
            subject: `Welcome to Edu - [name]`,
            text: convert(html),
            html: html
        };
        const mailResponse = await transporter.sendMail(mailOptions);
        logger.info(`Email sent successfully. Message ID: ${mailResponse.messageId}`);
    } catch (error) {
        logger.error(`Error while welcome mail:`, error);
    }
};

export default welcomeMail;

