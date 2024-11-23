const forgotPasswordTemplate = (code) => {
    return (
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    width: 100%;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                    margin: 40px auto;
                }
                h1 {
                    color: #333333;
                }
                .verification-code {
                    font-size: 20px;
                    font-weight: bold;
                    color: #007bff;
                    margin: 20px 0;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 14px;
                    color: #888888;
                    text-align: center;
                }
                .btn {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                    display: inline-block;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Password Reset Request</h1>
                <p>Dear User,</p>
                <p>We received a request to reset your password for your Mahakumbh Lost and Found account. Please use the following code to reset your password:</p>

                <div class="verification-code">
                    ${code}
                </div>

                <p>If you did not request a password reset, you can safely ignore this email.</p>

                <p>Thank you,</p>
                <p><strong>Mahakumbh Lost and Found Team</strong></p>

                <div class="footer">
                    <p>Mahakumbh Lost and Found, All Rights Reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `
    );
};

module.exports = forgotPasswordTemplate;
