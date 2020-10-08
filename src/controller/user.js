const userModel = require('../models/user')
const { success, failed, loginSuccess, failedLog } = require('../helpers/res')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const env = require('../helpers/env')
const sendMail = require('../helpers/Mail')
const upload = require('../helpers/upload')
const fs = require('fs')

const chat = {
    register: async (req, res) => {
        try {
            const data = req.body
            const password = req.body.password
            const salt = await bcrypt.genSalt(10)
            const generate = await bcrypt.hash(password, salt)
            const img = '404.png'
            userModel.register(data, generate, img)
                .then((result) => {
                    const email = data.email
                    const token = jwt.sign({ email: data.email }, env.SECRETKEY)
                    success(res, result, 'Please check your email')
                    sendMail(email, token)
                }).catch((err) => {
                    if (err.message === 'Duplicate entry') {
                        failed(res, [], 'User already exist')
                    } else {
                        failed(res, [], err.message)
                    }
                })
        } catch (err) {
            failed(res, [], 'Server internal error')
        }
    },
    login: (req, res) => {
        const body = req.body
        userModel.login(body)
            .then(async (result) => {
                if (!result[0]) {
                    failed(res, [], 'Email invalid')
                } else {
                    const data = result[0]
                    const pass = data.password
                    const password = req.body.password
                    const isMatch = await bcrypt.compare(password, pass)
                    if (data.status === 0) {
                        failedLog(res, [], "Please check your email to activation")
                    } else {
                        if (!isMatch) {
                            failedLog(res, [], "Password invalid")
                        } else {
                            const id = result[0].id_user
                            const name = result[0].name
                            const token_user = result[0].refreshToken
                            const token = jwt.sign({ id: id }, env.SECRETKEY, { expiresIn: 3600 })
                            const refresh = jwt.sign({ id: id }, env.SECRETKEY)
                            if (!token_user) {
                                userModel.loginToken(refresh, id)
                                    .then((result) => {
                                        loginSuccess(res, id,name, token, refresh, 'success login')
                                    })
                            } else {
                                loginSuccess(res, id,name, token, token_user, 'success login')
                            }
                        }
                    }
                }
            }).catch((err) => {
                failed(res, [], 'Server internal error')
            })
    },
    verify: (req, res) => {
        try {
            const token = req.params.token
            // console.log(token);
            jwt.verify(token, env.SECRETKEY, (err, decode) => {
                if (err) {
                    res.render('404')
                } else {
                    const data = jwt.decode(token)
                    const email = data.email
                    userModel.update(email).then((result) => {
                        res.render('index', { email })
                    }).catch(err => {
                        res.render('404')
                    })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    getUser: (req, res) => {
        try {
            const id = req.params.id
            userModel.getOne(id)
                .then((result) => {
                    success(res, result, 'success get user')
                }).catch((err) => {
                    failed(res, [], err.message)
                })
        } catch (err) {
            failed(res, [], "Server internal error")
        }
    },
    updateUser: (req, res) => {
        try {
            const body = req.body
            upload.single('image')(req, res, (err) => {
                if (err) {
                    if (err.code === `LIMIT_FIELD_VALUE`) {
                        failed(res, [], `Image size is to big`)
                    } else {
                        failed(res, [], err)
                    }
                } else {
                    const id = req.params.id
                    userModel.getOne(id)
                        .then((response) => {
                            const imageOld = response[0].image
                            body.image = !req.file ? imageOld : req.file.filename
                            if (body.image !== imageOld) {
                                if (imageOld !== '404.png') {
                                    fs.unlink(`src/img/${imageOld}`, (err) => {
                                        if (err) {
                                            failed(res, [], err.message)
                                        } else {
                                            userModel.updateUser(body, id)
                                                .then((result) => {
                                                    success(res, result, 'Update success')
                                                })
                                                .catch((err) => {
                                                    failed(res, [], err.message)
                                                })
                                        }
                                    })
                                } else {
                                    userModel.updateUser(body, id)
                                        .then((result) => {
                                            success(res, result, 'Update success')
                                        })
                                        .catch((err) => {
                                            failed(res, [], err.message)
                                        })
                                }
                            } else {
                                userModel.updateUser(body, id)
                                    .then((result) => {
                                        success(res, result, 'Update success')
                                    })
                                    .catch((err) => {
                                        failed(res, [], err.message)
                                    })
                            }
                        })
                }
            })
        } catch (err) {
            failed(res, [], 'Server Internal Error')
        }
    },
    addFriends: (req, res) => {
        const data = req.body
        userModel.addFriends(data)
            .then((result) => {
                success(res, result, 'Success insert friends')
            }).catch((err) => {
                failed(res, [], err.message)
            })
    },
    getFriends: (req, res) => {
        const id = req.params.id
        userModel.getFriends(id)
            .then((result) => {
                success(res, result, 'Success List friends')
            }).catch((err) => {
                failed(res, [], err.message)
            })
    }
}

module.exports = chat