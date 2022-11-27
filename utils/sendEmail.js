const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    console.log(process.env.SERVER)
    const transporter = nodemailer.createTransport({
      host: process.env.SERVER,
      port: 587,
      auth: {
        user: process.env.USR,
        pass: process.env.PASS,
      },
    });
    console.log("estoy aqui y pase el transporter")
    await transporter.sendMail({
      from: process.env.USR,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("estoy aqui y mande el mail")


    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;

