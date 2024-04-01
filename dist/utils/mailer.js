"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer_1 = tslib_1.__importDefault(require("nodemailer"));
const log_1 = tslib_1.__importDefault(require("./log"));
const config_1 = tslib_1.__importDefault(require("../config"));
const smtp = config_1.default.smtp;
//  export async function createTestCred(){
//   const creds = await nodemailer.createTestAccount()
//   console.log(creds)
//  }
const transporter = nodemailer_1.default.createTransport({
    host: smtp.host,
    port: parseInt(smtp.port),
    secure: smtp.secure === 'true',
    auth: {
        user: smtp.user,
        pass: smtp.pass
    }
});
function sendEmail(payload) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const info = yield transporter.sendMail(payload);
            log_1.default.info(`Email sent: ${info.messageId}`);
            log_1.default.info(`Preview URL: ${nodemailer_1.default.getTestMessageUrl(info)}`);
        }
        catch (error) {
            log_1.default.error(error, "Error sending mail");
            throw new Error("Error sending mail");
        }
    });
}
exports.default = sendEmail;
//# sourceMappingURL=mailer.js.map