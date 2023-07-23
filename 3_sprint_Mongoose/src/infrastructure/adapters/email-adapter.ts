import { injectable } from 'inversify';
import nodemailer from 'nodemailer'

const myPass = process.env.EMAIL_PASS

@injectable()
export class EmailAdapter {

    async sendEmailConfirmationMessage(email: string, subject: string, message: string): Promise<boolean> {
        try {
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
            return true

        } catch (e) {
            console.log('emailAdapter => sendEmailConfirmation => error:', e)
            return false
        }
    }

    async sendEmailPasswordRecovery(email: string, subject: string, message: string): Promise<boolean> {

        try {
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
            return true

        } catch (e) {
            console.log('emailAdapter => sendEmailConfirmation => error:', e)
            return false
        }
    }
}