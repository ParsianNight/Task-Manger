const sendGridApiKey = process.env.SENDGRID_API_KEY
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendGridApiKey)

const msg = {
    to: 'spaceboy20+usr1@wearehackerone.com', // Change to your recipient
    from: 'spaceboy20+usr1@wearehackerone.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}

const sendWelcomeMail = (email, name) => {
    sgMail
      .send({
        to: email,
        from: 'spaceboy20+usr1@wearehackerone.com',
        subject: 'Thanks for joining us',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app. `
    })
   
}
const sendByeMail = (email, name) => {
    sgMail
      .send({
        to: email,
        from: 'spaceboy20+usr1@wearehackerone.com',
        subject: 'Why are you leaving us?',
        text: `we are so sad that u made that call, ${name}. Let me know why are u sad. `
    })
}

module.exports = {sendWelcomeMail,sendByeMail}