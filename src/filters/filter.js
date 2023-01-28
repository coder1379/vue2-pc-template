/**
 *格式化时间
 *yyyy-MM-dd hh:mm:ss
 */
export function formatDate(time, fmt) {
  if (time === undefined || '') {
    return
  }
  const date = new Date(time)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

/**
 * 时间字符串格式转换为时间对象
 * @param dateString
 * @returns {null|Date}
 */
export function dateStringToDate(dateString) {
  if (dateString) {
    return new Date(Date.parse(dateString.replace(/-/g, '/')))
  }
  return null
}

/**
 * 获取生日的年龄
 * @param str
 * @returns {string|boolean}
 */
export function getAge(birthday) {
  if (!birthday) {
    return ''
  }

  const birthdays = new Date(birthday.replace(/-/g, '/'))
  const d = new Date()
  const age =
    d.getFullYear() -
    birthdays.getFullYear() -
    (d.getMonth() < birthdays.getMonth() ||
    (d.getMonth() == birthdays.getMonth() &&
      d.getDate() < birthdays.getDate())
      ? 1
      : 0)
  return age
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
/*
 * 隐藏用户手机号中间四位
 */
export function hidePhone(phone) {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 两个日期相隔天数,时间格式：yyyy-MM-dd
 * 第一个参数不传， 表示当前日期
 */
export function dateDiff(sDate1, sDate2) {
  if (sDate1 == sDate2) {
    return 0
  }
  if (!sDate1) {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    sDate1 = year + '-' + month + '-' + day
  }
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split('-')
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])// 转换为Mm-dd-yyyy格式,这种date的构造方式在苹果手机会报错，见解释
  aDate = sDate2.split('-')
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) // 把相差的毫秒数转换为天数
  return iDays
}

export function regFenToYuan(fen) {
  var num = fen
  num = fen * 0.01
  num += ''
  var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g
  num = num.replace(reg, '$1')
  num = toDecimal2(num)
  return num
}

export function transform(value) {
  const newValue = ['', '', '']
  let fr = 1000
  const ad = 1
  let num = 3
  const fm = 1
  while (value / fr >= 1) {
    fr *= 10
    num += 1
    // console.log('数字', value / fr, 'num:', num);
  }
  if (num <= 4) { // 千
    newValue[1] = '千'
    newValue[0] = parseInt(value / 1000) + ''
  } else if (num <= 8) { // 万
    const text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
    // tslint:disable-next-line:no-shadowed-variable
    const fm = text1 === '万' ? 10000 : 10000000
    newValue[1] = text1
    newValue[0] = (value / fm) + ''
  } else if (num <= 16) { // 亿
    let text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
    text1 = (num - 8) / 4 > 1 ? '万亿' : text1
    text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
    // tslint:disable-next-line:no-shadowed-variable
    let fm = 1
    if (text1 === '亿') {
      fm = 100000000
    } else if (text1 === '千亿') {
      fm = 100000000000
    } else if (text1 === '万亿') {
      fm = 1000000000000
    } else if (text1 === '千万亿') {
      fm = 1000000000000000
    }
    newValue[1] = text1
    newValue[0] = parseInt(value / fm) + ''
  }
  if (value < 1000) {
    newValue[1] = ''
    newValue[0] = value + ''
  }
  return newValue.join('')
}

export function toDecimal2(x) {
  var f = parseFloat(x)
  if (isNaN(f)) {
    return ''
  }
  var f = Math.round(x * 100) / 100
  var s = f.toString()
  var rs = s.indexOf('.')
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + 2) {
    s += '0'
  }
  return s
}
