
const response = {
    success: (res, data, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: data
        }
        res.json(result)
    },
    failed: (res, data, message) => {
        const result = {
            code: 500,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    failedLog: (res, data, message) => {
        const result = {
            code: 401,
            status: false,
            message: message,
            data: data
        }
        res.json(result)
    },
    loginSuccess: (res, id ,name ,token, refreshToken, message) => {
        const result = {
            code: 200,
            status: true,
            message: message,
            data: {
                id,
                name,
                token,
                refreshToken
            }
        }
        res.json(result)
    },
}

module.exports = response