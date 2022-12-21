import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'
require('dotenv').config();
import jwt from 'jsonwebtoken'


var salt = bcrypt.genSaltSync(10);


const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (pass, passHash) => {
    return bcrypt.compareSync(pass, passHash);
}

const randomString = () => {
    return uuidv4();
}

const sendEmail = async (toEmail, title, contentHTML) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASS_EMAIL,
        },
    });


    let info = await transporter.sendMail({
        from: `"TechStoreTvT ⚔ ⚓ 👻" <${process.env.EMAIL}>`,
        to: toEmail,
        subject: title,
        html: contentHTML,
    });
}

const decodeToken = (token, primaryKey) => {
    try {
        var decoded = jwt.verify(token, primaryKey);
        return decoded
    } catch (e) {
        return null;
    }
}


module.exports = {
    hashPassword,
    randomString,
    sendEmail,
    comparePassword,
    decodeToken
}