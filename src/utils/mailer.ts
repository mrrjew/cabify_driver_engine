import nodemailer, { SendMailOptions } from 'nodemailer';
import log from './log';
import config from '../config';

const smtp = config.smtp;

//  export async function createTestCred(){
//   const creds = await nodemailer.createTestAccount()
//   console.log(creds)
//  }

const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: parseInt(smtp.port), // Ensure port is a number
    secure: smtp.secure === 'true', // Convert secure to a boolean value
    auth: {
      user: smtp.user,
      pass: smtp.pass
    }
  });
  
async function sendEmail(payload: SendMailOptions) {
  try {
    const info = await transporter.sendMail(payload);
    log.info(`Email sent: ${info.messageId}`);
    log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    log.error(error, "Error sending mail");
    throw new Error("Error sending mail");
  }
}

export default sendEmail;
