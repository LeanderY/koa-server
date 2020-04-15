const { LinValidator, Rule } = require('../../core/lin-validator-v2')
const { ArtType, LoginType } = require('../lib/enum')
const User = require('@models/user')

class PositiveIntegerValidator extends LinValidator {
    constructor() {
        super()
        this.id = [
            new Rule('isInt', '需要是正整数', {
                min: 1
            })
        ]
    }
}

class RegisterValidator extends LinValidator {
    constructor() {
        super()
        this.nickname = [
            new Rule('isLength', '昵称不符合长度规范', {
                min: 4,
                max: 8
            })
        ]
        this.email = [new Rule('isEmail', '不符合email规范')]
        this.password1 = [
            // 用户密码指定范围
            new Rule('isLength', '密码至少6个字符，最多32个字符', {
                min: 6,
                max: 32
            }),
            new Rule('matches', '密码不符合规范', '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]')
        ]
        this.password2 = this.password1
    }

    // vals 包含用户传递过来的所有参数
    validatePassword(vals) {
        const pwd1 = vals.body.password1
        const pwd2 = vals.body.password2
        if (pwd1 !== pwd2) {
            throw new Error('两个密码必须相同')
        }
    }

    // 验证邮箱
    async validateEmail(vals) {
        const email = vals.body.email
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (user) {
            throw new Error('email已存在')
        }
    }
}

class LoginValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule('isLength', '不符合账号规则', {
                min: 4,
                max: 32
            })
        ]

        this.secret = [
            new Rule('isOptional'),
            new Rule('isLength', '至少6个字符', {
                min: 2,
                max: 128
            })
        ]

        const checker = new Checker(LoginType)
        this.validateType = checker.check.bind(checker)
    }
}

class NotEmptyValidator extends LinValidator {
    constructor() {
        super()
        this.token = [
            new Rule('isLength', '不允许为空', {
                min: 1
            })
        ]
    }
}

class LikeValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        const checker = new Checker(ArtType)
        this.validateType = checker.check.bind(checker)
    }
}

class SearchValidator extends LinValidator {
    constructor() {
        super()
        this.key = [
            new Rule('isLength', '搜索关键词不能为空', {
                min: 1,
                max: 16
            })
        ]
        this.page = [
            new Rule('isInt', '不符合规范', {
                min: 0,
                max: 60000
            }),
            new Rule('isOptional', '', 0)
        ]
        this.count = [
            new Rule('isInt', '不符合规范', {
                min: 1,
                max: 20
            }),
            new Rule('isOptional', '', 20)
        ]
    }
}

class AddShortCommentValidator extends PositiveIntegerValidator {
    constructor() {
        super()
        this.content = [
            new Rule('isLength', '必须在1到12个字符之间', {
                min: 1,
                max: 12
            })
        ]
    }
}

class Checker {
    constructor(type) {
        this.enumType = type
    }

    check(vals) {
        let type = vals.body.type || vals.path.type
        if (!type) {
            throw new Error('type是必须参数')
        }

        type = parseInt(type)
        
        if (!this.enumType.isThisType(type)) {
            throw new Error('type参数不合法')
        }
    }
}

module.exports = {
    PositiveIntegerValidator,
    RegisterValidator,
    LoginValidator,
    NotEmptyValidator,
    LikeValidator,
    SearchValidator,
    AddShortCommentValidator
}
