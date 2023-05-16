import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {

    async sendEmailConfirmationMessage(email: string, code: string): Promise<void> {

        const message = `<h1>Thank you for registration!</h1>
<p>Please, follow the link to finish your registration:<a href="https://www.youtube.com/?code=${code}">complete registration</a></p>`
        await emailAdapter.sendEmailConfirmation(email, `Confirmation Email`, message);
        return;
    }
}