import nodemailer from 'nodemailer'
import {NODE_ENVS_ENUM} from "../helpers/enums";

const myPass = process.env.EMAILPASS
const currentEnv = process.env.NODE_ENV || 'development'
export const emailAdapter = {

    async sendEmail(email: string, subject: string, message: string): Promise<boolean> {
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
    },

    async sendMock(){

        return true
    },

    async sendEmailConfirmation(email: string, subject: string, message: string): Promise<boolean> { // todo mock так реализовывать?

        if (currentEnv === NODE_ENVS_ENUM.TESTING) return this.sendMock()
        return this.sendEmail(email, subject, message)
    }
}