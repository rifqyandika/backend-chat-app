const db = require('../config/config')

const user = {
    register: (data, generate ,img) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO user (name, email, password, image) VALUES ('${data.name}', '${data.email}', '${generate}', '${img}')`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    login: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user WHERE email='${data.email}'`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getUser: () => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user`,(err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    insertChat: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO message (from_, to_, chat) VALUES ('${data.sender}', '${data.recevier}', '${data.message}')`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    getMessage: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM message WHERE (from_='${data.sender}' AND to_='${data.recevier}') OR (from_='${data.recevier}' AND to_='${data.sender}')`, (err, result) => {
                if(err) {
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    },
    loginToken: (token, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE user SET refreshToken='${token}' WHERE id_user=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    update: (email) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE user SET status= 1 WHERE email='${email}'`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    getOne: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user WHERE id_user=${id}`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    updateUser: (data, id) => {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE user SET ? WHERE id_user = ${id}`, [data, id], (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    resolve(result)
                }
            })
        })
    },
    addFriends: (data) => {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO contact (user_id, friend_id) VALUES('${data.user_id}','${data.friend_id}')`, (err, result) => {
                if (err) {
                    reject(new Error(err))
                } else {
                    db.query(`INSERT INTO contact (user_id, friend_id) VALUES('${data.friend_id}','${data.user_id}')`, (err, result) => {
                        if(err){
                            reject(new Error(err))
                        } else {
                            resolve(result)
                        }
                    })
                }
            })
        })
    },
    getFriends: (id) => {
        return new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user INNER JOIN contact on user.id_user = contact.user_id WHERE friend_id=${id}`, (err, result) => {
                if(err){
                    reject(new Error(err))
                }else{
                    resolve(result)
                }
            })
        })
    }
}

module.exports = user