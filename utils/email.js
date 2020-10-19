const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0]
    this.url = url
    this.from = `Sproviero matias <${process.env.EMAIL_FROM}>`
    }

  newTransport() {
    if(process.env.NODE_ENV === 'production '){

      return nodemailer.createTransport({
        service: 'SendGrid',
        auth:{
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      })
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }); 
  }
   async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url:this.url,
      subject
    })

    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html)
    };
    
    await this.newTransport().sendMail(mailOption);

  }
  async sendWelcome(){
    await this.send('welcome', 'Welcome to the Natours Family')
  }
  async sendPasswordReset() {
    await this.send('passwordReset',
     'Your password rest token (Valid for only 10 minutes)' )
  }
  
}



  



