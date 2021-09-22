const sgMail = require("@sendgrid/mail");

module.exports = class SendGridMail {
    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    sendMail = async (to, subject, text, html = "") => {
        const from = process.env.COMPANY_MAIL;
        return this.sendMailFrom(from, to, subject, text, html);
    }

    sendMailFrom = async (from, to, subject, text, html = "") => {
        try{
            const msg = {
                from,
                to,
                subject,
                text,
                html
            };

            if(!html)
                delete msg.html;
        
            return sgMail.send(msg);
        } catch (err) {
            const error = new Error(err.message);
            error.code = 400;
            throw error;
        }
    }
}