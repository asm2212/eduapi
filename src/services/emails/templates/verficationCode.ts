const emailVerificationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>Add commentMore actions
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification | EDU</title>
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
<!--         <img src="https://via.placeholder.com/40" alt="Company Logo"> -->
      <h1>LMS</h1>
        <h2>Confirm your account</h1>
        <p>Please click the button below to confirm your email address and finish setting up your account. This link is valid for 48 hours.</p>
        <a href="#" class="button">Confirm</a>
        <div class="footer">
            <p>LMS &nbsp;| <a href="#">3alearningsolutions.com</a></p>
        </div>
    </div>
</body>
</html>`;
export default emailVerificationHtml;
