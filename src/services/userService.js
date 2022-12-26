import db from '../models'
require('dotenv').config();
import jwt from 'jsonwebtoken'

import commont from '../services/commont'

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

            let [user, created] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    pass: hasePass,
                    idTypeUser: 3,
                    keyVerify: keyVerify,
                    statusUser: 'wait',
                    typeAccount: 'web'
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
    const { id, lastName, firstName, email } = user;
    const accessToken = jwt.sign({ id, lastName, firstName, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '300s'
    });
    const refreshToken = jwt.sign({ id, lastName, firstName, email }, process.env.REFESH_TOKEN_SECRET, {
        expiresIn: '24h'
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
                        id: +data.id,
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

const loginGoogle = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.firstName || !data.lastName || !data.idGoogle || !data.avatar || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            }
            else {
                //
                let [user, created] = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        firstName: data.firstName,
                        lastName: data.lastName,

                        idTypeUser: 3,
                        typeAccount: 'google',

                        statusUser: 'true',
                        avatarGoogle: data.avatar
                    },
                    raw: false
                });

                if (user.statusUser === 'true') {
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
                        idTypeUser: 3,
                        typeAccount: 'facebook',

                        statusUser: 'true',
                        avatarFacebook: data.avatarFacebook
                    },
                    raw: false
                });

                if (user.statusUser === 'true') {
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


module.exports = {
    CreateUser,
    verifyCreateUser,
    userLogin,
    refreshToken,
    getUserLogin,
    loginGoogle,
    loginFacebook
}