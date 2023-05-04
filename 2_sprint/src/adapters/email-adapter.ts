import nodemailer from 'nodemailer'

const myPass = process.env.EMAILPASS
export const emailAdapter = {

    async sendEmailConfirmationMessage(email: string, subject: string, message: string): Promise<void> {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'itincubator9@gmail.com',
                pass: myPass,
            }
        });

        await transporter.sendMail({
            from: 'Егор Матафонов <itincubator9@gmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: message// plain text body
        });
        return;
    }
}