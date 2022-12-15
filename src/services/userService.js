import db from '../models'

import commont from '../services/commont'

const CreateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            let hasePass = commont.hashPassword(data.pass);
            let token = commont.randomString();

            const [user, created] = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    pass: hasePass,
                    token: token,
                    idTypeUser: 3,
                    statusUser: 'wait'
                }
            });

            if (!created) {

                //Tài khoản đã tồn tại
                if (user.statusUser === 'true') {
                    resolve({
                        errCode: 1,
                        errMessage: 'Tài khoản này đã tồn tại!'
                    })
                }
                //Tài khoản chưa được xác nhận
                else if (user.statusUser === 'wait') {
                    //update data
                    user.firstName = data.firstName
                    user.lastName = data.lastName
                    user.pass = hasePass
                    user.token = token

                    //send email


                    resolve({
                        errCode: 0,
                        errMessage: 'Tài khoản chưa được xác nhận'
                    })
                }

            }
            else {
                //send email

                resolve({
                    errCode: 0,
                    errMessage: 'Đã tạo tài khoản'
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    CreateUser
}