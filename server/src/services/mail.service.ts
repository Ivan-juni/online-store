import nodemailer from 'nodemailer'

export default class MailService {
  static async sendActivationMail(to: string, link: string) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    } as nodemailer.TransportOptions)

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Account activation on ${process.env.API_URL}:${process.env.PORT}`,
      text: '',
      html: `
      <div>
        <h1>
          To activate your account please click the link below
        </h1>
        <a href="${link}">${link}</a>
      </div>
      `,
    })
  }
}
