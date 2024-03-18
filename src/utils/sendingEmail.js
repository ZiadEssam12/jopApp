import nodemailer from "nodemailer";

export default async function sendingEmail({ to, subject, text }) {
  const transporter = nodemailer.createTransport({
    host: "localhost",
    port: 465,
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.STMP_EMAIL,
      pass: process.env.STMP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"Job App" ziadessam1287@gmail.com', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
  });
  return info.accepted.length > 0 ? true : false;
}
