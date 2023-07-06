import {EmailAdapter} from "../adapters/email-adapter";
import {EmailManager} from "../managers/email-manager";

const emailAdapter = new EmailAdapter();
export const emailManager = new EmailManager(emailAdapter);
