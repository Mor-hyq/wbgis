// 国际化示例 只有中文
// 实际作用是设置某些前端字段名称
import zhLocale from './zh'

const language = 'zh'

const lang = {
  zh: {
    ...zhLocale
  }
}

export default lang[language]
