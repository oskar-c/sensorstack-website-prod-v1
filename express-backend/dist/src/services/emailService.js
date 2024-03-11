import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
export const sendEmail = async (emailOptions)=>{
    try {
        await transporter.sendMail(emailOptions);
        // If email sent successfully and there are attachments, delete them
        if (emailOptions.attachments) {
            emailOptions.attachments.forEach((attachment)=>{
                fs.unlink(attachment.path, (err)=>{
                    if (err) {
                        console.error(`Failed to delete file: ${attachment.path}`, err);
                    } else {
                        console.log(`File deleted: ${attachment.path}`);
                    }
                });
            });
        }
        return {
            success: true,
            message: 'Email sent successfully'
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: 'Failed to send email'
        };
    }
};

//# sourceMappingURL=emailService.js.map