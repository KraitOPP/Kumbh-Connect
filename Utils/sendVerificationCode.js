const verificationTemplate = require("../verificationMailTemplate");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASS,
  },
  connectionTimeout:10000,
});


const sendMail = async (code,email)=>{
    try {
        const mailOptions = {
            from:{
                name:"Mahakumbh Lost and Found",
                address:process.env.USER,
                
            }, 
            to: email, 
            subject: "Password Reset Code",
            text: "",
            html: verificationTemplate(code),
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error Sending Mail", error);
        throw new Error("Failed to Send Verification Code");
    }
}

module.exports = sendMail