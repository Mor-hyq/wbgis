import {
  validatePhone,
  validatePhone2,
  validateMobile,
  validateAccount,
  validateRealName,
  validatePassword
} from './validate'

export const validatePasswordFunc = (rule, value, callback) => {
  // 当密码必填时
  if (rule.required) {
    if (!value) {
      callback(new Error('请输入密码'))
    } if (value.length < 6) {
      callback(new Error('密码长度不能小于6位'))
    } else if (!validatePassword(value)) {
      callback(new Error('密码不能包含中文及空格'))
    } else {
      callback()
    }
  } else {
    // 当非必填时
    if (value) {
      if (value.length < 8) {
        callback(new Error('密码长度不能小于8位'))
      } else if (!validatePassword(value)) {
        callback(new Error('密码不能包含中文及空格'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}
export const validateSmsCodeFunc = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请填写验证码'))
  } else if (value.length !== 6) {
    callback(new Error('验证码长度有误'))
  } else {
    callback()
  }
}
export const validateMobileFunc = (rule, value, callback) => {
  const tips = rule.tips ? rule.tips : '电话号码'
  if (rule.required) {
    if (!value) {
      callback(new Error(`请填写${tips}`))
    } else if (!validateMobile(value)) {
      callback(new Error(`请填写正确的${tips}`))
    } else {
      callback()
    }
  } else {
    if (value) {
      if (!validateMobile(value)) {
        callback(new Error(`请输入正确的${tips}`))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}
export const validatePhoneFunc = (rule, value, callback) => {
  const tips = rule.tips ? rule.tips : '手机号'
  if (rule.required) {
    if (!value) {
      callback(new Error(`请填写${tips}`))
    } else if (!validatePhone(value)) {
      callback(new Error(`请填写正确的${tips}`))
    } else {
      callback()
    }
  } else {
    if (value) {
      if (!validatePhone(value)) {
        callback(new Error(`请输入正确的${tips}`))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}
export const validatePhone2Func = (rule, value, callback) => {
  const tips = rule.tips ? rule.tips : '联系电话'
  if (rule.required) {
    if (!value) {
      callback(new Error(`请填写${tips}`))
    } else if (!validatePhone2(value)) {
      callback(new Error(`请填写正确的${tips}`))
    } else {
      callback()
    }
  } else {
    if (value) {
      if (!validatePhone2(value)) {
        callback(new Error(`请输入正确的${tips}`))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
}
export const validateAccountFunc = (rule, value, callback) => {
  const account = rule.accountTip ? rule.accountTip : '名称'
  if (!value) {
    callback(new Error(`请填写${account}`))
  } else if (value.length < 2 || value.length > 15) {
    callback(new Error(`${account}长度为2至15位`))
  } else if (!validateAccount(value)) {
    callback(new Error(`${account}不能包含特殊符号`))
  } else {
    callback()
  }
}

export const validateRealNameFunc = (rule, value, callback) => {
  const account = rule.accountTip ? rule.accountTip : '姓名'
  if (!value) {
    callback(new Error(`请填写${account}`))
  } else if (!validateRealName(value)) {
    callback(new Error(`${account}不能包含特殊符号`))
  } else {
    callback()
  }
}
