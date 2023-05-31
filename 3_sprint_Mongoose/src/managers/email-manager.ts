import {emailAdapter} from "../adapters/email-adapter";

export const emailManager = {

    async sendEmailConfirmationMessage(email: string, code: string): Promise<void> {

        const message = `<h1>Thank you for registration!</h1>
<p>Please, follow the link to finish your registration:<a href='https://www.youtube.com/?code=${code}'>complete registration</a></p>`
        await emailAdapter.sendEmailConfirmationMessage(email, `Confirmation Email`, message);
        return;
    },

    async sendEmailPasswordRecovery(email: string, code: string): Promise<void> {

        const message = `<h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
      </p>`;

        await emailAdapter.sendEmailPasswordRecovery(email, `Password recovery`, message);
        return;
    }
}