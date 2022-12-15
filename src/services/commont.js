import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';


var salt = bcrypt.genSaltSync(10);


const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}

const randomString = () => {
    return uuidv4();
}

const sendEmail = (toEmail, title, contentHTML) => {

}

module.exports = {
    hashPassword,
    randomString,
    sendEmail
}