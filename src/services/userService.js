import db from '../models'
require('dotenv').config();
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid';
import Verifier from 'email-verifier'
const { Op } = require("sequelize");

const paypal = require('paypal-rest-sdk');
import commont from '../services/commont'
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
var cloudinary = require('cloudinary');
// await cloudinary.v2.uploader.destroy('vznd4hds4kudr0zbvfop')

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
});
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

let GG_Drive = {
    setFilePublic: async (fileId) => {
        try {
            await drive.permissions.create({
                fileId,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            })

            const getUrl = await drive.files.get({
                fileId,
                fields: 'webViewLink, webContentLink'
            })

            return getUrl;
        } catch (error) {
            console.error(error);
        }
    },
    uploadFile: async (name) => {
        try {
            const createFile = await drive.files.create({
                requestBody: {
                    name: "iloveyou_anh1.mp4",
                    mimeType: 'video/mp4'
                },
                media: {
                    mimeType: 'video/mp4',
                    body: fs.createReadStream(path.join(__dirname, `../public/videoTam/${name}`))
                }
            })
            const fileId = createFile.data.id;
            const getUrl = await GG_Drive.setFilePublic(fileId);

            return {
                url: getUrl.data.webViewLink,
                id: createFile.data.id
            }

        } catch (error) {
            console.error(error);
        }
    },
    deleteFile: async (fileId) => {
        try {
            const deleteFile = await drive.files.delete({
                fileId: fileId
            })
        } catch (error) {
            console.error(error);
        }
    }
}



let verifier_email = new Verifier(process.env.API_KEY_VERIFY_EMAIL, {
    checkCatchAll: false,
    checkDisposable: false,
    checkFree: false,
    validateDNS: false,
    validateSMTP: true,
});

const CreateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.pass || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            let hasePass = commont.hashPassword(data.pass);
            let keyVerify = commont.randomString();


            verifier_email.verify(data.email, { hardRefresh: true }, async (err, res) => {
                if (err) throw err;
                if (res.smtpCheck === 'false') {
                    resolve({
                        errCode: 3,
                        errMessage: 'Email này không tồn tại, vui lòng kiểm tra lỗi chính tả!'
                    })
                    return;
                }
                else {
                    let [user, created] = await db.User.findOrCreate({
                        where: { email: data.email },
                        defaults: {
                            firstName: data.firstName,
                            lastName: data.lastName,
                            pass: hasePass,
                            idTypeUser: "3",
                            keyVerify: keyVerify,
                            statusUser: 'wait',
                            typeAccount: 'web',
                            id: uuidv4()
                        },
                        raw: false
                    });

                    if (!created) {

                        //Tài khoản đã tồn tại
                        if (user.statusUser === 'true') {
                            resolve({
                                errCode: 2,
                                errMessage: 'Tài khoản này đã tồn tại!'
                            })
                        }
                        //Tài khoản chưa được xác nhận
                        else if (user.statusUser === 'wait') {

                            //update data
                            user.firstName = data.firstName
                            user.lastName = data.lastName
                            user.pass = hasePass
                            user.keyVerify = keyVerify
                            await user.save();

                            //create token
                            let tokens = CreateToken(user);

                            //send email
                            let title = 'Xác nhận tạo tài khoản TechStoreTvT';
                            let contentHtml = contentSendEmail(user.id, user.keyVerify, user.firstName);
                            commont.sendEmail(user.email, title, contentHtml)

                            resolve({
                                errCode: 0,
                                errMessage: 'Tài khoản chưa được xác nhận',
                                data: {
                                    accessToken: tokens.accessToken,
                                    refreshToken: tokens.refreshToken,
                                    keyVerify
                                }
                            })
                        }

                    }
                    else {
                        //create token
                        let tokens = CreateToken(user);

                        //send email
                        let title = 'Xác nhận tạo tài khoản TechStoreTvT';
                        let contentHtml = contentSendEmail(user.id, user.keyVerify, user.firstName);
                        commont.sendEmail(user.email, title, contentHtml)

                        resolve({
                            errCode: 0,
                            errMessage: 'Đã tạo tài khoản',
                            data: {
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken,
                                keyVerify
                            }
                        })
                    }
                }

            });


        }
        catch (e) {
            reject(e);
        }
    })
}

const contentSendEmail = (idUser, keyVerify, firstName) => {
    return `
    <div style="width: 500px;margin: 0 auto; max-width: 100%;border: 1px solid #ccc;">
    <div style="background-color: #cfcfcf59;
    padding-top: 10px;">
        <div
            style="background-image: url(https://lh3.googleusercontent.com/fife/AAbDypAdsHNBHCVq3uw3uJQOMh2ziZ4jnrolzc784lF36xx776YKpDtD6qaJh1BkxPHJO3edFvMN3HMycQORpUKbFLDPMvT0uX-mDIVHSGW0Lq8EmthaE5GZTmxlh8cCVsL5uwDl-LLLYe96rlQUNrSHmOeAh_zwvbtAKZmKsB3LqHXSmkEvtLMwFWkEmfMqxNrz7cbj5LsmqyLgCNQzXawTmcMgk1VC9kZBHIHaz7poGA0Y8uYd7wjmZagyYwALxa4Om1Zt0vcPMXWpf8EA8OMq6FY6OdIUVWOAxtIvmnpDNvgPGbCA_RfOr9IOefJaUJL7thOYd8TS9x9rPdieUVt1V5NxnbednRk6Cf2LPGZ4Y4Hku3e3oeJ1deoZFKXUZ82cEF0HAzpa14p_4GEuFI9ab6oU7xyYg4XaSadEsaC_MFdZUWWpe8xAs64a9UD3rGPgtO52iETIK-Q_rw40-uOXb_w2SeLF-tb04-SODAv4fOl4jut5hubNHhgpIJxZqoh_RT6dr5iAVg7d-9aQH2J9LggL_EI5yHj05z9c4XEsRWi-ODVHOUc1BjgjKHhs6CKkXGmRadOigsr--XJyl1RwBAdL2VP-8esNe9b6Nhry0c0PHxVBoYSCnbdT5Ci0AB_dYp8wGe1_upt05jYl7JSYDnVytXLQj2PtKuL7SZkpuqFQTaaj-9srFTbXcCi9TpGluMXpAp63m8PzuiJmREN9XhHowbiCB6Vi59pJ-PuofqoD3ON0WrwSm3BGp_1D3klbji23Fmgbom9eqAHBC732wa-Pd1tD6fflsiFxHBO9jNc4lKwGrPD7Kq8w9tX3LsnUM7ebAqTvtUuLicfwRp4LdlZ57TsVIkgfhyo7LUftSxs7WqF6RahIdlwuRAUFaZG32iMFUpfP5irTSEzBp8px7af-vLYDRAyzJUfEERnJ47MzrFAjB9GESWXg4qcBgL9afjHeZ55Sjj7h2o7FmtRzSQdyQS8As1nyUqw_EYa_KJwDaWAbh5G69RoGdlxIjo9CL1Vj_7dHpdyFf-0KdS2gMbCZScjlPNTq-TxClGCx8x3BGwOTVY1tyHmZYxiJN7ixBZclk17OgXt_euHmKSa6GpyirTuiGQK5aQ-glVEysGCkW8WPNjuq9n3XfUghn1y4gwOvjCIg1N7yVOpCA7-_3VYdtDEHkeZEFo6pmLxCyo9Uars0-Pc-vLamcuwNVVQnkEzwLDd7VdlKuWlebBqcrCnI_Tt5_NO-L4w28d7evy9Mt4ao9WJDReq4c0cJGmVDF9sxGnZAi5hJF33BSPYAEs67V2PxUb4tzwJ_eVL5sxKEq9mmUyNWhSePpfchUUCOeA1-G0Z2ohR7TRqjOaeew33mMp11VeKw3LAelLVX1GwnhbSTtl3A0cLFtRDi9L_h7okAP41rdBPHXsxvzwRQd0cs3E10r9KsOxJwcqDSoY5ukaZM4FKeGFa7Qodo6jm7TeSX65C32zXbjAK5F1ibV8z1cEBhuCE80sluX4bwr3LSvdEWalhNIwpgj2862Lpo_iL_upU1zoiuzQCSkmlw0u5nEfbILZJT6rYpiXi6Lr4UkL6jJzBEMJhSPw=w1920-h901);background-size: cover;width: 150px;height: 90px;">
        </div>
    </div>
    <div style="    padding: 10px;">
        <h3 style="    margin-top: 30px;">Xin chào, ${firstName}</h3>
        <div style="margin-bottom: 10px;">Cảm ơn bạn đã ghé thăm và sử dụng dịch vụ của chúng tôi.</div>
        <div>Để kích hoạt tài khoản của bạn, xin vui lòng bấm vào xác nhận bên dưới</div>
        <div style="    text-align: center;">
            <a href="${process.env.LINK_FONTEND}/account/verify?id=${idUser}&keyVerify=${keyVerify}" style="    padding: 10px 20px;
        border: none;
        color: #fff;
        background-color: #000958;
        border-radius: 4px;
        cursor: pointer;
        display: block;
        width: fit-content;
        margin: 14px auto;text-decoration: none;">Xác nhận</a>
        </div>
        <div>Nếu bạn không liên hệ với TechStore hoặc cảm thấy mình nhận được thông báo này do nhầm lẫn, chỉ cần bỏ
            qua
            email này để hệ thống của chúng tôi tự động xóa.
        </div>
    </div>
    <div style="background-color: #cfcfcf59;
    padding: 20px 0;
    margin: 20px 0px 0px;
    text-align: center;">Copyright © 2022. All rights reserved.</div>
</div>
    `
}

const CreateToken = (user) => {
    const { id, idGoogle, firstName, idTypeUser } = user;
    const accessToken = jwt.sign({ id, idGoogle, firstName, idTypeUser }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });
    const refreshToken = jwt.sign({ id, idGoogle, firstName, idTypeUser }, process.env.REFESH_TOKEN_SECRET, {
        expiresIn: '3d'
    });

    return { accessToken, refreshToken };
}

const verifyCreateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.keyVerify) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        id: data.id,
                        keyVerify: data.keyVerify,
                        statusUser: 'wait'
                    },
                    raw: false
                })

                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tài khoản không tồn tại hoặc đã được kích hoạt từ trước đó!'
                    })
                }
                else {
                    user.statusUser = 'true';

                    await user.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Kích hoạt tài khoản thành công. Cảm ơn vì đã xác nhận.',
                        keyVerify: data.keyVerify
                    })
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const userLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.pass) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {

                let user = await db.User.findOne({
                    where: {
                        email: data.email,
                    }
                })

                if (!user || user.statusUser === 'wait' || !commont.comparePassword(data.pass, user.pass)) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tài khoản hoặc mật khẩu không chính xác!',
                    })
                }
                else {
                    //check block VV
                    if (user.statusUser === 'false') {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tài khoản đã bị khóa vô thời hạn!'
                        })
                    }
                    else if (user.statusUser === 'true') {
                        let tokens = CreateToken(user);
                        resolve({
                            errCode: 0,
                            errMessage: 'Đăng nhập thành công!',
                            data: tokens
                        })
                    }
                    else {
                        let timeBlock = +user.statusUser;
                        let timeCurrent = new Date().getTime();
                        if (timeBlock < timeCurrent) {
                            let tokens = CreateToken(user);
                            resolve({
                                errCode: 0,
                                errMessage: 'Đăng nhập thành công!',
                                data: tokens
                            })
                        }
                        else {
                            //check thời gian còn lại khi bị khóa

                        }
                    }
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const refreshToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.refreshToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //decode refreshToken
                let decoded = commont.decodeToken(data.refreshToken, process.env.REFESH_TOKEN_SECRET);

                if (decoded !== null) {
                    let tokens = CreateToken(decoded);
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo token thành công!',
                        data: tokens
                    });
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'RefreshToken đã hết hạn hoặc không thể giải mã!'
                    });
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getUserLogin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //decode accessToken
                let decoded = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET);

                if (decoded !== null) {

                    let user = await db.User.findOne({
                        where: {
                            id: decoded.id
                        },
                        attributes: {
                            exclude: ['pass', 'keyVerify', 'createdAt', 'updatedAt']
                        }
                    })

                    if (user) {
                        let date = new Date().getTime();
                        if (user.statusUser !== 'wait' && user.statusUser !== 'false') {
                            if (user.statusUser === 'true') {
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Get user succeed!',
                                    data: user
                                });
                            }
                            else {
                                if (+user.statusUser < date) {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Get user succeed!',
                                        data: user
                                    });
                                }
                                else {
                                    resolve({
                                        errCode: 3,
                                        errMessage: 'Not found user!',
                                    });
                                }
                            }

                        }
                        else {
                            resolve({
                                errCode: 3,
                                errMessage: 'Not found user!',
                            });
                        }

                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found user!',
                        });
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'AccessToken đã hết hạn hoặc không thể giải mã!'
                    });
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getUserLoginRefreshToken = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.refreshToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //decode accessToken
                let decoded = commont.decodeToken(data.refreshToken, process.env.REFESH_TOKEN_SECRET);

                if (decoded !== null) {

                    let user = await db.User.findOne({
                        where: {
                            id: decoded.id
                        },
                        attributes: {
                            exclude: ['pass', 'keyVerify', 'createdAt', 'updatedAt']
                        }
                    })

                    if (user) {
                        let date = new Date().getTime();
                        if (user.statusUser !== 'wait' && user.statusUser !== 'false') {
                            if (user.statusUser === 'true') {

                                resolve({
                                    errCode: 0,
                                    errMessage: 'Get user succeed!',
                                    data: user,
                                    tokens: CreateToken(user)
                                });
                            }
                            else {
                                if (+user.statusUser < date) {
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'Get user succeed!',
                                        data: user,
                                        tokens: CreateToken(user)
                                    });
                                }
                                else {
                                    resolve({
                                        errCode: 3,
                                        errMessage: 'Not found user!',
                                    });
                                }
                            }

                        }
                        else {
                            resolve({
                                errCode: 3,
                                errMessage: 'Not found user!',
                            });
                        }

                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found user!',
                        });
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'refreshToken đã hết hạn hoặc không thể giải mã!'
                    });
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}


const loginGoogle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.idGoogle || !data.avatar) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [user, created] = await db.User.findOrCreate({
                    where: {
                        idGoogle: data.idGoogle,
                        typeAccount: 'google',
                    },
                    defaults: {
                        firstName: data.firstName,
                        lastName: data.lastName,

                        idTypeUser: "3",


                        statusUser: 'true',
                        avatarGoogle: data.avatar,
                        id: uuidv4()
                    },
                    raw: false
                });

                if (user.statusUser === 'true') {
                    user.avatarGoogle = data.avatar
                    await user.save();
                    //create token
                    let tokens = CreateToken(user);
                    resolve({
                        errCode: 0,
                        errMessage: 'Đăng nhập thành công!',
                        data: {
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken
                        }
                    })
                }
                else if (user.statusUser === 'false') {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tài khoản đã bị khóa vĩnh viễn!'
                    })
                }
                else if (user.statusUser === 'wait') {
                    resolve({
                        errCode: 3,
                        errMessage: 'Tài khoản chưa được kích hoạt!'
                    })
                }
                else {
                    const date = new Date().getTime()
                    if (+user.statusUser > date) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Tài khoản đang bị tạm khóa!'
                        })
                    }
                    else {
                        //create token
                        let tokens = CreateToken(user);
                        resolve({
                            errCode: 0,
                            errMessage: 'Đăng nhập thành công!',
                            data: {
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken
                            }
                        })
                    }
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const loginFacebook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.idFacebook || !data.avatarFacebook) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [user, created] = await db.User.findOrCreate({
                    where: { idFacebook: data.idFacebook },
                    defaults: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: 'none',
                        idTypeUser: "3",
                        typeAccount: 'facebook',

                        statusUser: 'true',
                        avatarFacebook: data.avatarFacebook,
                        id: uuidv4()
                    },
                    raw: false
                });

                if (user.statusUser === 'true') {
                    user.avatarFacebook = data.avatarFacebook
                    await user.save();
                    //create token
                    let tokens = CreateToken(user);
                    resolve({
                        errCode: 0,
                        errMessage: 'Đăng nhập thành công!',
                        data: {
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken
                        }
                    })
                }
                else if (user.statusUser === 'false') {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tài khoản đã bị khóa vĩnh viễn!'
                    })
                }
                else if (user.statusUser === 'wait') {
                    resolve({
                        errCode: 3,
                        errMessage: 'Tài khoản chưa được kích hoạt!'
                    })
                }
                else {
                    const date = new Date().getTime()
                    if (+user.statusUser > date) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Tài khoản đã bị khóa theo ngày!'
                        })
                    }
                    else {
                        //create token
                        let tokens = CreateToken(user);
                        resolve({
                            errCode: 0,
                            errMessage: 'Đăng nhập thành công!',
                            data: {
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken
                            }
                        })
                    }
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const loginGithub = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.idGithub || !data.avatarGithub) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [user, created] = await db.User.findOrCreate({
                    where: { idGithub: data.idGithub },
                    defaults: {
                        firstName: data.firstName,
                        lastName: 'none',
                        email: 'none',
                        idTypeUser: 3,
                        typeAccount: 'github',

                        statusUser: 'true',
                        avatarGithub: data.avatarGithub
                    },
                    raw: false
                });

                if (user.statusUser === 'true') {
                    user.avatarGithub = data.avatarGithub
                    //create token
                    let tokens = CreateToken(user);
                    resolve({
                        errCode: 0,
                        errMessage: 'Đăng nhập thành công!',
                        data: {
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken
                        }
                    })
                }
                else if (user.statusUser === 'false') {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tài khoản đã bị khóa vĩnh viễn!'
                    })
                }
                else if (user.statusUser === 'wait') {
                    resolve({
                        errCode: 3,
                        errMessage: 'Tài khoản chưa được kích hoạt!'
                    })
                }
                else {
                    const date = new Date().getTime()
                    if (+user.statusUser > date) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Tài khoản đã bị khóa theo ngày!'
                        })
                    }
                    else {
                        //create token
                        let tokens = CreateToken(user);
                        resolve({
                            errCode: 0,
                            errMessage: 'Đăng nhập thành công!',
                            data: {
                                accessToken: tokens.accessToken,
                                refreshToken: tokens.refreshToken
                            }
                        })
                    }
                }

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const addProductToCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct || !data.amount || !data.idClassifyProduct || !data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    //check exits product and classify
                    let product = await db.product.findOne({
                        where: { id: data.idProduct }
                    })
                    let classifyProduct = await db.classifyProduct.findOne({
                        where: {
                            id: data.idClassifyProduct,
                            idProduct: data.idProduct
                        }
                    })
                    if (!product || !classifyProduct) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Lỗi không tìm thấy sản phẩm hoặc phân loại, vui lòng thử lại sau!'
                        })
                    }
                    else {
                        if (product.isSell === 'false') {
                            resolve({
                                errCode: 4,
                                errMessage: 'Sản phẩm đã ngừng bán!'
                            })
                            return;
                        }

                        if (+data.amount > classifyProduct.amount) {
                            resolve({
                                errCode: 5,
                                errMessage: 'Hàng trong kho không còn đủ!'
                            })
                            return;
                        }


                        let [cart, create] = await db.cart.findOrCreate({
                            where: {
                                idUser: idUser,
                                idProduct: data.idProduct,
                                idClassifyProduct: data.idClassifyProduct,
                            },
                            defaults: {
                                amount: +data.amount,
                                isChoose: 'false',
                                id: uuidv4()
                            },
                            raw: false

                        })
                        if (!create) {
                            cart.amount = (cart.amount + (data.amount * 1)) <= classifyProduct.amount ?
                                (cart.amount + (data.amount * 1)) : classifyProduct.amount
                            await cart.save();
                            resolve({
                                errCode: 0,
                                errMessage: 'Đã thêm vào giỏ hàng'
                            })
                        }
                        else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Đã thêm vào giỏ hàng'
                            })
                        }
                    }
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const addCartOrMoveCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idProduct || !data.amount || !data.idClassifyProduct || !data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    //check exits product and classify
                    let product = await db.product.findOne({
                        where: { id: data.idProduct }
                    })
                    let classifyProduct = await db.classifyProduct.findOne({
                        where: {
                            id: data.idClassifyProduct,
                            idProduct: data.idProduct
                        }
                    })
                    if (!product || !classifyProduct) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Lỗi không tìm thấy sản phẩm hoặc phân loại, vui lòng thử lại sau!'
                        })
                    }
                    else {
                        if (product.isSell === 'false') {
                            resolve({
                                errCode: 4,
                                errMessage: 'Sản phẩm đã ngừng bán!'
                            })
                            return;
                        }

                        let [cart, create] = await db.cart.findOrCreate({
                            where: {
                                idUser: idUser,
                                idProduct: data.idProduct,
                                idClassifyProduct: data.idClassifyProduct
                            },
                            defaults: {
                                amount: +data.amount
                            },
                            raw: false

                        })
                        if (!create) {
                            let sl = classifyProduct.amount
                            cart.amount = (cart.amount + +data.amount) <= sl ? (cart.amount + +data.amount) : sl
                            await cart.save()

                            resolve({
                                errCode: 0,
                                errMessage: 'Sản phẩm đã có trong giỏ hàng'
                            })
                        }
                        else {
                            resolve({
                                errCode: 0,
                                errMessage: 'Đã thêm vào giỏ hàng'
                            })
                        }
                    }
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const addNewAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.country === '-1' || data.district === "-1" || !data.nameAddress || !data.nameUser || !data.sdtUser || !data.addressText || !data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let [addressUser, create] = await db.addressUser.findOrCreate({
                        where: {
                            idUser,
                            nameAddress: data.nameAddress.toLowerCase(),
                        },
                        defaults: {
                            isDefault: 'false',
                            fullname: data.nameUser,
                            sdt: data.sdtUser,
                            country: data.country,
                            district: data.district,
                            addressText: data.addressText,
                            id: uuidv4(),
                            status: 'true'
                        },
                        raw: false
                    })

                    if (!create) {
                        let checkStatusAdress = await db.addressUser.findOne({
                            where: {
                                idUser,
                                nameAddress: data.nameAddress.toLowerCase(),
                            }
                        })

                        if (checkStatusAdress.status === 'true') {
                            resolve({
                                errCode: 3,
                                errMessage: 'Tên địa chỉ này đã tồn tại!',
                            })
                        }
                        else {
                            let updateAddress = await db.addressUser.findOne({
                                where: {
                                    idUser,
                                    isDefault: 'true',
                                    status: 'true'
                                },
                                raw: false
                            })
                            if (updateAddress) {
                                updateAddress.isDefault = 'false'
                                await updateAddress.save()
                            }

                            addressUser.status = 'true'
                            addressUser.isDefault = 'true'
                            addressUser.fullname = data.nameUser
                            addressUser.sdt = data.sdtUser
                            addressUser.country = data.country
                            addressUser.district = data.district
                            addressUser.addressText = data.addressText

                            await addressUser.save();

                            resolve({
                                errCode: 0,
                                errMessage: 'Thêm địa chỉ thành công.',
                            })
                        }
                    }
                    else {
                        let updateAddress = await db.addressUser.findOne({
                            where: {
                                idUser,
                                isDefault: 'true',
                            },
                            raw: false
                        })
                        if (updateAddress) {
                            updateAddress.isDefault = 'false'
                            await updateAddress.save()
                        }

                        addressUser.isDefault = 'true'
                        await addressUser.save();

                        resolve({
                            errCode: 0,
                            errMessage: 'Thêm địa chỉ thành công.',
                        })

                    }

                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const getAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let addressUser = await db.addressUser.findAll({
                        where: {
                            idUser,
                            status: 'true'
                        },
                        order: [['id', 'ASC']]
                    })

                    if (addressUser) {
                        resolve({
                            errCode: 0,
                            data: addressUser
                        })
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Not found!',
                        })
                    }

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const setDefaultAddress = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let address = await db.addressUser.findOne({
                        where: {
                            idUser,
                            isDefault: 'true'
                        },
                        raw: false
                    })
                    if (address) {
                        address.isDefault = 'false'
                        await address.save()
                    }

                    let addressUser = await db.addressUser.findOne({
                        where: {
                            id: data.id
                        },
                        raw: false
                    })

                    if (addressUser) {
                        addressUser.isDefault = 'true'
                        addressUser.save()

                        resolve({
                            errCode: 0,
                            errMessage: 'success',
                        })
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy địa chỉ này!',
                            decode
                        })
                    }

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let address = await db.addressUser.findOne({
                        where: {
                            idUser,
                            id: data.id
                        },
                        raw: false
                    })
                    if (address) {
                        address.isDefault = 'false'
                        address.status = 'false'
                        await address.save()

                        let addressDefault = await db.addressUser.findOne({
                            where: {
                                idUser,
                                isDefault: 'true',
                                status: 'true'
                            }
                        })
                        if (!addressDefault) {
                            let addressDefault2 = await db.addressUser.findOne({
                                where: {
                                    idUser,
                                    isDefault: 'false',
                                    status: 'true'
                                },
                                raw: false
                            })

                            if (addressDefault2) {
                                addressDefault2.isDefault = 'true'
                                await addressDefault2.save();
                            }
                        }

                        resolve({
                            errCode: 0,
                        })
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy địa chỉ này!',
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const editAddressUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id || data.country === '-1' || data.district === '-1' || !data.nameUser ||
                !data.nameAddress || !data.sdtUser || !data.addressText) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let check = await db.addressUser.findOne({
                        where: {
                            idUser,
                            nameAddress: data.nameAddress,
                            id: {
                                [Op.ne]: data.id
                            },
                            status: 'true'
                        }
                    })

                    if (!check) {

                        let address = await db.addressUser.findOne({
                            where: {
                                idUser,
                                id: data.id
                            },
                            raw: false
                        })

                        if (address) {
                            address.nameAddress = data.nameAddress
                            address.fullname = data.nameUser
                            address.sdt = data.sdtUser
                            address.country = data.country
                            address.district = data.district
                            address.addressText = data.addressText

                            await address.save()

                            resolve({
                                errCode: 0,
                            })
                        }
                        else {
                            resolve({
                                errCode: 3,
                                errMessage: 'Không tìm thấy địa chỉ này',
                            })
                        }
                    }
                    else {
                        resolve({
                            errCode: 4,
                            errMessage: 'Tên địa chỉ này đã tồn tại!',
                        })
                    }

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const getListCartUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let carts = await db.cart.findAll({
                        where: {
                            idUser
                        },
                        include: [
                            {
                                model: db.classifyProduct,
                            },
                            {
                                model: db.product,
                                include: [
                                    {
                                        model: db.imageProduct, as: 'imageProduct-product',
                                        attributes: {
                                            exclude: ['createdAt', 'updatedAt', 'id']
                                        }
                                    },
                                    {
                                        model: db.promotionProduct,
                                        attributes: {
                                            exclude: ['createdAt', 'updatedAt', 'id']
                                        },
                                    },
                                    {
                                        model: db.classifyProduct, as: 'classifyProduct-product',
                                        attributes: {
                                            exclude: ['createdAt', 'updatedAt']
                                        }
                                    },
                                ],
                                raw: false,
                                nest: true
                            },
                        ],
                        order: [['stt', 'DESC']],
                        raw: false,
                        nest: true
                    })

                    resolve({
                        errCode: 0,
                        data: carts
                    })

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const editAmountCartUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id || !data.typeEdit) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let cart = await db.cart.findOne({
                        where: {
                            idUser,
                            id: data.id
                        },
                        raw: false
                    })

                    if (cart) {
                        let cartTemp = await db.cart.findOne({
                            where: {
                                idUser,
                                id: data.id
                            }
                        })

                        if (data.typeEdit === 'prev') {
                            if (cartTemp.amount !== 1) {
                                cart.amount = cart.amount - 1
                                await cart.save();
                            }
                            resolve({
                                errCode: 0,
                            })
                        }
                        else if (data.typeEdit === 'next') {
                            let classifyProduct = await db.classifyProduct.findOne({
                                where: {
                                    id: cartTemp.idClassifyProduct
                                }
                            })

                            let sl = classifyProduct.amount

                            if (cartTemp.amount < sl) {
                                cart.amount = cart.amount + 1
                                await cart.save();
                                resolve({
                                    errCode: 0,
                                })
                            }
                            else {
                                resolve({
                                    errCode: 4,
                                    errMessage: 'Xin lỗi, số lượng sản phẩm trong kho không còn đủ!'
                                })
                                return;
                            }

                        }
                        else if (data.typeEdit === 'value') {
                            let classifyProduct = await db.classifyProduct.findOne({
                                where: {
                                    id: cartTemp.idClassifyProduct
                                }
                            })

                            let sl = classifyProduct.amount
                            if (Number.isInteger(+data.value)) {
                                if (+data.value < 1) {
                                    cart.amount = 1
                                    await cart.save()
                                    resolve({
                                        errCode: 0,
                                    })
                                }
                                else if (+data.value > sl) {
                                    cart.amount = sl
                                    await cart.save()
                                    resolve({
                                        errCode: 4,
                                        errMessage: `Rất tiếc số lượng trong kho chỉ còn ${sl} sản phẩm!`
                                    })
                                }
                                else {
                                    cart.amount = +data.value
                                    await cart.save()
                                    resolve({
                                        errCode: 0,
                                    })
                                }
                            }
                            else {
                                cart.amount = 1
                                await cart.save()
                            }
                        }
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy sản phẩm trong giỏ hàng!',
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const chooseProductInCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let cart = await db.cart.findOne({
                        where: {
                            idUser,
                            id: data.id
                        },
                        raw: false
                    })
                    if (!cart) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy sản phẩm này trong giỏ hàng!',
                        })
                    }
                    else {
                        cart.isChoose = cart.isChoose === 'true' ? 'false' : 'true'
                        await cart.save()

                        resolve({
                            errCode: 0,
                        })
                    }

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteProductInCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let cart = await db.cart.findOne({
                        where: {
                            idUser,
                            id: data.id
                        },
                        raw: false
                    })
                    if (!cart) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy sản phẩm này trong giỏ hàng!',
                        })
                    }
                    else {
                        await cart.destroy()

                        resolve({
                            errCode: 0,
                        })
                    }

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const updateClassifyProductInCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idCart || !data.idClassify) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let classifyProduct = await db.classifyProduct.findOne({
                        where: {
                            id: data.idClassify
                        }
                    })

                    if (classifyProduct) {
                        let cart = await db.cart.findOne({
                            where: {
                                idUser,
                                id: data.idCart
                            },
                            raw: false
                        })

                        if (cart) {
                            cart.idClassifyProduct = classifyProduct.id
                            cart.amount = 1
                            await cart.save()
                        }

                        resolve({
                            errCode: 0,
                        })
                    }
                    else {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy loại sản phẩm!',
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const createNewBill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.Totals) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let addressUser = await db.addressUser.findOne({
                        where: {
                            idUser,
                            isDefault: 'true'
                        }
                    })

                    let cart = await db.cart.findAll({
                        where: {
                            idUser,
                            isChoose: 'true'
                        },
                        raw: true
                    })

                    if (!addressUser) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Vui lòng chọn địa chỉ nhận hàng!',
                        })
                        return;
                    }

                    if (cart.length === 0) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Vui lòng chọn sản phẩm bạn muốn mua!',
                        })
                        return;
                    }

                    //check isSell product
                    let IsSell = true;
                    let nameProductIsSell
                    cart.forEach(async item => {
                        let product = await db.product.findOne({
                            where: {
                                id: item.idProduct,
                                isSell: "false",
                            }
                        })
                        if (product) {
                            IsSell = false;
                            nameProductIsSell = product.nameProduct
                        }
                    })

                    if (!IsSell) {
                        resolve({
                            errCode: 5,
                            errMessage: `Sản phâm "${nameProductIsSell}" đã không còn bán nửa.`
                        })

                        return;
                    }




                    //handle buy product

                    let bill = await db.bill.create({
                        id: uuidv4(),
                        idUser,
                        timeBill: new Date().getTime() + '',
                        idStatusBill: '1',
                        idAddressUser: addressUser.id,
                        note: data.note || '',
                        totals: +data.Totals,
                        payment: 'hand'
                    })

                    let arrayDetailBill = cart.map(item => {
                        return {
                            id: uuidv4(),
                            idBill: bill.id,
                            idProduct: item.idProduct,
                            amount: item.amount,
                            isReviews: 'false',
                            idClassifyProduct: item.idClassifyProduct,
                        }
                    })

                    await db.detailBill.bulkCreate(arrayDetailBill, { individualHooks: true })

                    await db.cart.destroy({
                        where: {
                            idUser,
                            isChoose: 'true'
                        }
                    })

                    resolve({
                        errCode: 0,
                        idBill: bill.id
                    })

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const chooseAllProductInCart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    await db.cart.update(
                        {
                            isChoose: data.type ? 'true' : 'false'
                        },
                        {
                            where: {
                                idUser
                            }
                        }
                    )

                    resolve({
                        errCode: 0,
                    })

                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const getListBillByType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.type) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {

                    let idUser = decode.id;
                    let countType1 = await db.bill.count({
                        where: {
                            idUser,
                            idStatusBill: '1',
                        },
                    })
                    let countType2 = await db.bill.count({
                        where: {
                            idUser,
                            idStatusBill: '2',
                        },
                    })

                    if (data.type !== '0') {
                        let listBills = await db.bill.findAll({
                            where: {
                                idUser,
                                idStatusBill: data.type,
                            },
                            limit: 5,
                            offset: data.offset,
                            include: [
                                {
                                    model: db.detailBill,
                                    include: [
                                        {
                                            model: db.product,
                                            include: [
                                                {
                                                    model: db.imageProduct, as: 'imageProduct-product',
                                                },
                                                { model: db.promotionProduct },
                                            ],
                                        },
                                        {
                                            model: db.classifyProduct,
                                        },
                                    ],
                                }
                            ],
                            order: [
                                ['updatedAt', 'DESC']
                            ],
                            raw: false,
                            nest: true

                        })
                        let count = await db.bill.count({
                            where: {
                                idUser,
                                idStatusBill: data.type,
                            }
                        })
                        resolve({
                            errCode: 0,
                            data: listBills,
                            count,
                            countType1,
                            countType2,
                        })
                    }

                    else {
                        let listBills = await db.bill.findAll({
                            where: {
                                idUser,
                            },
                            limit: 5,
                            offset: data.offset,
                            include: [
                                {
                                    model: db.detailBill,
                                    include: [
                                        {
                                            model: db.product,
                                            include: [
                                                { model: db.imageProduct, as: 'imageProduct-product' },
                                                { model: db.promotionProduct },
                                            ],
                                        },
                                        {
                                            model: db.classifyProduct,
                                        },

                                    ],
                                }
                            ],
                            order: [
                                ['updatedAt', 'DESC']
                            ],
                            raw: false,
                            nest: true

                        })

                        let count = await db.bill.count({
                            where: {
                                idUser
                            }
                        })
                        resolve({
                            errCode: 0,
                            data: listBills,
                            count,
                            countType1,
                            countType2,
                        })
                    }


                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const userCancelBill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let bill = await db.bill.findOne({
                        where: {
                            id: data.id
                        },
                        include: [
                            {
                                model: db.User,
                                where: {
                                    id: idUser
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    if (!bill) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy hóa đơn!',
                            decode
                        })
                    }
                    else {
                        bill.idStatusBill = '4'
                        bill.noteCancel = data.note
                        await bill.save();

                        resolve({
                            errCode: 0,
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const userRepurchaseBill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let bill = await db.bill.findOne({
                        where: {
                            id: data.id
                        },
                        include: [
                            {
                                model: db.User,
                                where: {
                                    id: idUser
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    if (!bill) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy hóa đơn!',
                            decode
                        })
                    }
                    else {
                        let detailBill = await db.detailBill.findAll({
                            where: {
                                idBill: bill.id
                            },
                        })

                        let array = detailBill.map(item => {
                            return {
                                id: uuidv4(),
                                idUser,
                                idProduct: item.idProduct,
                                amount: item.amount,
                                idClassifyProduct: item.idClassifyProduct,
                                isChoose: 'false'
                            }
                        });

                        await db.cart.bulkCreate(array, { individualHooks: true })

                        resolve({
                            errCode: 0,
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const getCodeVeridyForgetPass = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email
                    },
                    raw: false
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Email không chính xác hoặc chưa được đăng kí!',
                    })
                }
                else {
                    let timeCurrent = new Date().getTime();
                    if (user.statusUser === 'false') {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tài khoản đã bị khóa vĩnh viễn!',
                        })
                        return;
                    }
                    else if (user.statusUser !== 'true' && +user.statusUser > timeCurrent) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Tài khoản đang bị tạm khóa!',
                        })
                        return;
                    }

                    //gửi email
                    let rd = Math.floor(Math.random() * 900000) + 100000;
                    user.keyVerify = rd.toString();
                    await user.save();

                    commont.sendEmail(
                        data.email,
                        "Mã xác nhận TechStoreTvT",
                        `<h3>Mã xác nhận của bạn là: ${rd}</h3>
                        <div>Lưu ý: không gửi mã này cho bất kì ai.</div>
                        `
                    )

                    resolve({
                        errCode: 0,
                        // keyVerify: rd.toString()
                    })



                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const changePassForget = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.keyVerify || !data.pass) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email,
                        keyVerify: data.keyVerify
                    },
                    raw: false
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Có lỗi xảy ra vui lòng thử lại sau!',
                    })
                }
                else {
                    let hasePass = commont.hashPassword(data.pass);

                    user.pass = hasePass
                    await user.save();

                    resolve({
                        errCode: 0,
                    })

                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const checkKeyVerify = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.keyVerify) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let user = await db.User.findOne({
                    where: {
                        email: data.email,
                        keyVerify: data.keyVerify
                    },
                    raw: false
                })
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mã xác nhận không chính xác!',
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                    })

                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const hasReceivedProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;
                    let bill = await db.bill.findOne({
                        where: {
                            idUser,
                            id: data.id
                        },
                        raw: false
                    })

                    if (!bill) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Lỗi không tìm thấy đơn hàng!',
                        })
                    }
                    else {
                        bill.idStatusBill = '3'
                        await bill.save();

                        resolve({
                            errCode: 0,
                        })
                    }

                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const buyProductByCard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;


                    let addressUser = await db.addressUser.findOne({
                        where: {
                            idUser,
                            isDefault: 'true'
                        }
                    })

                    let cart = await db.cart.findAll({
                        where: {
                            idUser,
                            isChoose: 'true'
                        },
                        raw: true
                    })

                    if (!addressUser) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Vui lòng chọn địa chỉ nhận hàng!',
                        })
                        return;
                    }

                    if (cart.length === 0) {
                        resolve({
                            errCode: 4,
                            errMessage: 'Vui lòng chọn sản phẩm bạn muốn mua!',
                        })
                        return;
                    }

                    //check isSell product
                    let IsSell = true;
                    let nameProductIsSell
                    cart.forEach(async item => {
                        let product = await db.product.findOne({
                            where: {
                                id: item.idProduct,
                                isSell: "false",
                            }
                        })
                        if (product) {
                            IsSell = false;
                            nameProductIsSell = product.nameProduct
                        }
                    })

                    if (!IsSell) {
                        resolve({
                            errCode: 5,
                            errMessage: `Sản phâm "${nameProductIsSell}" đã không còn bán nửa.`
                        })
                        return;
                    }

                    let cart2 = await db.cart.findAll({
                        where: {
                            idUser,
                            isChoose: 'true'
                        },
                        include: [
                            {
                                model: db.product
                            },
                            {
                                model: db.classifyProduct
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    let totals = 0;

                    let arrayProduct = cart.map((item, index) => {

                        let price;
                        if (cart2[index].classifyProduct.nameClassifyProduct === 'default')
                            price = +cart2[index].product.priceProduct
                        else
                            price = cart2[index].classifyProduct.priceClassify


                        totals = totals + (Math.floor(price / 23000) * +item.amount)
                        price = Math.floor(price / 23000) + '.00'


                        return {
                            name: cart2[index].product.nameProduct,
                            sku: cart2[index].classifyProduct.nameClassifyProduct,
                            price: price,
                            currency: "USD",
                            quantity: +item.amount
                        }
                    })

                    console.log("array ", arrayProduct);
                    console.log('totals: ', totals + '.00');

                    const create_payment_json = {
                        "intent": "sale",
                        "payer": {
                            "payment_method": "paypal"
                        },
                        "redirect_urls": {
                            "return_url":
                                `${process.env.LINK_BACKEND}/api/v1/buy-product-by-card/success?price=${totals + '.00'}&accessToken=${data.accessToken}&totalsReq=${data.totalsReq}`,
                            "cancel_url": `${process.env.LINK_BACKEND}/api/v1/buy-product-by-card/cancel`
                        },
                        "transactions": [{
                            "item_list": {
                                "items": arrayProduct
                            },
                            "amount": {
                                "currency": "USD",
                                "total": totals + '.00'
                            },
                            "description": "Shop TechStoreTvT siêu tiện siêu rẽ."
                        }]
                    };

                    paypal.payment.create(create_payment_json, function (error, payment) {
                        if (error) {
                            throw error;
                        } else {
                            for (let i = 0; i < payment.links.length; i++) {
                                if (payment.links[i].rel === 'approval_url') {
                                    // res.redirect(payment.links[i].href);
                                    resolve({
                                        errCode: 0,
                                        errMessage: 'ok',
                                        link: payment.links[i].href
                                    })
                                }
                            }

                        }
                    });

                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const buyProductByCardSucess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    const payerId = data.PayerID;
                    const paymentId = data.paymentId;
                    const price = data.price

                    const execute_payment_json = {
                        "payer_id": payerId,
                        "transactions": [{
                            "amount": {
                                "currency": "USD",
                                "total": price
                            }
                        }]
                    };
                    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                        if (error) {
                            console.log(error.response);
                            throw error;
                        } else {
                            console.log('mua thanh cong');

                            let addressUser = await db.addressUser.findOne({
                                where: {
                                    idUser,
                                    isDefault: 'true'
                                }
                            })

                            let cart = await db.cart.findAll({
                                where: {
                                    idUser,
                                    isChoose: 'true'
                                },
                                raw: true
                            })

                            //handle buy product

                            let bill = await db.bill.create({
                                id: uuidv4(),
                                idUser,
                                timeBill: new Date().getTime() + '',
                                idStatusBill: '1',
                                idAddressUser: addressUser.id,
                                note: data.note || '',
                                totals: +data.totalsReq,
                                payment: 'card'
                            })

                            let arrayDetailBill = cart.map(item => {
                                return {
                                    id: uuidv4(),
                                    idBill: bill.id,
                                    idProduct: item.idProduct,
                                    amount: item.amount,
                                    isReviews: 'false',
                                    idClassifyProduct: item.idClassifyProduct,
                                }
                            })

                            await db.detailBill.bulkCreate(arrayDetailBill, { individualHooks: true })

                            await db.cart.destroy({
                                where: {
                                    idUser,
                                    isChoose: 'true'
                                }
                            })

                            resolve({
                                errCode: 0,
                            })
                        }
                    });
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const createNewEvaluateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idDetailBill || !data.star) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let detailBill = await db.detailBill.findOne({
                        where: {
                            id: data.idDetailBill,
                        },
                        include: [
                            {
                                model: db.bill,
                                where: {
                                    idUser
                                }
                            }
                        ],
                        raw: false,
                        nest: true
                    })

                    if (!detailBill || detailBill.isReviews === 'true') {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy hoặc bạn không được phép thực hiện tính năng này!',
                        })
                    }
                    else {
                        let evaluateProduct = await db.evaluateProduct.create({
                            id: uuidv4(),
                            idUser,
                            idProduct: detailBill.idProduct,
                            starNumber: data.star,
                            content: data.content || '',
                            displayname: '' + data.displayName || 'true',
                            idDetailBill: data.idDetailBill
                        })

                        detailBill.isReviews = 'true'
                        await detailBill.save();

                        resolve({
                            errCode: 0,
                            data: {
                                id: evaluateProduct.id
                            }
                        })
                    }
                }
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

const uploadVideoEvaluateProduct = (id, url) => {
    return new Promise(async (resolve, reject) => {
        try {
            let urlVideo = await GG_Drive.uploadFile(url)

            await db.videoEvaluateProduct.create({
                id: uuidv4(),
                idEvaluateProduct: id,
                videobase64: urlVideo.url,
                idGGDrive: urlVideo.id
            })

            resolve({
                errCode: 0,
            })

        }
        catch (e) {
            reject(e);
        }
    })
}

const uploadImagesEvaluateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let array = data.files.map(item => {
                return {
                    id: uuidv4(),
                    imagebase64: item.path,
                    idEvaluateProduct: data.query.id,
                    idCloudinary: item.filename
                }
            })
            await db.imageEvaluateProduct.bulkCreate(array, { individualHooks: true })

            resolve({
                errCode: 0,
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

const createNewEvaluateProductFailed = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let detailbill = await db.detailBill.findOne({
                where: {
                    id: data.idDetailBill
                },
                raw: false
            })
            if (!detailbill) {
                resolve({
                    errCode: 1,
                    errMessage: 'not found detail bill'
                })
            }
            else {
                detailbill.isReviews = 'false'
                await detailbill.save()

                await db.evaluateProduct.destroy({
                    where: {
                        id: data.idEvaluate
                    }
                })

                await db.imageEvaluateProduct.destroy({
                    where: {
                        idEvaluateProduct: data.idEvaluate
                    }
                })

                await db.videoEvaluateProduct.destroy({
                    where: {
                        idEvaluateProduct: data.idEvaluate
                    }
                })



                resolve({
                    errCode: 0,
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const updataEvaluateProduct = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.accessToken || !data.idDetailBill || !data.listImage || !data.star
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let decode = commont.decodeToken(data.accessToken, process.env.ACCESS_TOKEN_SECRET)
                if (decode === null) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Kết nối quá hạn, vui lòng tải lại trang và thử lại!',
                        decode
                    })
                }
                else {
                    let idUser = decode.id;

                    let evaluateProduct = await db.evaluateProduct.findOne({
                        where: {
                            idUser,
                            idDetailBill: data.idDetailBill
                        },
                        raw: false
                    })
                    if (!evaluateProduct) {
                        resolve({
                            errCode: 3,
                            errMessage: 'Không tìm thấy hoặc bạn không được phép thực hiện tính năng này!',
                        })
                    }
                    else {
                        evaluateProduct.starNumber = data.star
                        evaluateProduct.content = data.text
                        evaluateProduct.displayname = data.displayname
                        await evaluateProduct.save();

                        let imageEvaluateProduct = await db.imageEvaluateProduct.findAll({
                            where: {
                                idEvaluateProduct: evaluateProduct.id,
                                imagebase64: {
                                    [Op.notIn]: data.listImage
                                }
                            }
                        })
                        imageEvaluateProduct.forEach(async item => {
                            await cloudinary.v2.uploader.destroy(item.idCloudinary)
                        })

                        await db.imageEvaluateProduct.destroy({
                            where: {
                                idEvaluateProduct: evaluateProduct.id,
                                imagebase64: {
                                    [Op.notIn]: data.listImage
                                }
                            }
                        })

                        resolve({
                            errCode: 0,
                            id: evaluateProduct.id
                        })
                    }
                }
            }

        }
        catch (e) {
            reject(e);
        }
    })
}

const deleteVideoEvaluate = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.idDetailBill) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!',
                    data
                })
            }
            else {
                let evaluateProduct = await db.evaluateProduct.findOne({
                    where: {
                        idDetailBill: data.idDetailBill
                    }
                })

                let video = await db.videoEvaluateProduct.findOne({
                    where: {
                        idEvaluateProduct: evaluateProduct.id
                    }
                })

                if (video) {
                    await GG_Drive.deleteFile(video.idGGDrive)
                }


                await db.videoEvaluateProduct.destroy({
                    where: {
                        idEvaluateProduct: evaluateProduct.id
                    }
                })

                resolve({
                    errCode: 0,
                })
            }

        }
        catch (e) {
            reject(e);
        }
    })
}


const updateVideoEvaluate = (id, filename) => {
    return new Promise(async (resolve, reject) => {
        try {
            let evaluateProduct = await db.evaluateProduct.findOne({
                where: {
                    idDetailBill: id
                }
            })
            let videoOld = await db.videoEvaluateProduct.findOne({
                where: {
                    idEvaluateProduct: evaluateProduct.id
                }
            })
            await GG_Drive.deleteFile(videoOld.idGGDrive)
            await db.videoEvaluateProduct.destroy({
                where: {
                    idEvaluateProduct: evaluateProduct.id
                }
            })


            let urlVideo = await GG_Drive.uploadFile(filename)

            await db.videoEvaluateProduct.create({
                id: uuidv4(),
                idEvaluateProduct: evaluateProduct.id,
                videobase64: urlVideo.url,
                idGGDrive: urlVideo.id
            })

            resolve({
                errCode: 0,
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    CreateUser,
    verifyCreateUser,
    userLogin,
    refreshToken,
    getUserLogin,
    loginGoogle,
    loginFacebook,
    loginGithub,
    addProductToCart,
    addCartOrMoveCart,
    addNewAddressUser,
    getAddressUser,
    setDefaultAddress,
    deleteAddressUser,
    editAddressUser,
    getListCartUser,
    editAmountCartUser,
    chooseProductInCart,
    deleteProductInCart,
    updateClassifyProductInCart,
    createNewBill,
    chooseAllProductInCart,
    getUserLoginRefreshToken,
    getListBillByType,
    userCancelBill,
    userRepurchaseBill,
    getCodeVeridyForgetPass,
    changePassForget,
    checkKeyVerify,
    hasReceivedProduct,
    buyProductByCard,
    buyProductByCardSucess,
    createNewEvaluateProduct,
    uploadVideoEvaluateProduct,
    uploadImagesEvaluateProduct,
    createNewEvaluateProductFailed,
    updataEvaluateProduct,
    deleteVideoEvaluate,
    updateVideoEvaluate
}