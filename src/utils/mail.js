import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendMail=async (options) => {
    const mailGenerator=new Mailgen({
        theme :"default",
        product:{
            name:"Video Project",
            link :"https://video-ptoject.com"
        }
    });
    const emailTextural=mailGenerator.generatePlaintext(options.mailgenContent)
    const emailHtml=mailGenerator.generate(options.mailgenContent)

    const transporator=nodemailer.createTransport({
         host:process.env.MAILTRAP_STMP_HOST,
  port:process.env.MAILTRAP_STMP_PORT,
  auth: {
    user:process.env.MAILTRAP_STMP_USER,
    pass:process.env.MAILTRAP_STMP_PASS
  }
    })
    const mail={
    from:"videoproject@gmail.com",
    to: options.email,
    subject: options.subject,
    text: emailTextural,
    html:emailHtml
    }
    try {
        await transporator.sendMail(mail)
    } catch (error) {
        console.error("Mail does not send",error)
    }
}

const emailVerificationMailgenContent=(username,verificationUrl) => {
    return {
         body: {
        name: username,
        intro: 'Welcome to our app! We are very excited to have you on board.',
        action: {
            instructions: 'To get started with App, please click here:',
            button: {
                color: '#056a31',
                text: 'Confirm your account',
                link: verificationUrl
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we love to help.'
    }
    }
}

export {emailVerificationMailgenContent,sendMail}