import nodemailer from 'nodemailer'

export async function sendOtpEmail(to: string, otp: string) {
  // These should be configured in the Admin UI and stored in the database
  // For now, we use environment variables or default values
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const mailOptions = {
    from: process.env.SMTP_FROM || '"PTC LDAP" <noreply@ptc.local>',
    to,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
  }

  await transporter.sendMail(mailOptions)
}
