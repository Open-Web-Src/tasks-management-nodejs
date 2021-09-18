module.exports = mailService => {
    const sendWelComeMail = async (to, name) => {
        const subject = "Welcome to Task Management App";
        const text = `Hi ${name}, Thank you for joining us, let we know how you get along with this app`;
        
        mailService.sendMail(to, subject, text);
    };

    const sendCancelationMail = async (to, name) => {
        const subject = "We're sorry to see you go";
        const text = `Goodbye ${name}, We hope to see you back sometime soon`;
        
        mailService.sendMail(to, subject, text);
    }

    return { 
        sendWelComeMail, 
        sendCancelationMail 
    };
};