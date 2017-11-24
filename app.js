const rpn = require('request-promise-native')
const async = require('async')

const urls = [
  'http://www.24x7mag.com/2017/11/focus-year-ahead/?ref=fr-title',
  'http://www.24x7mag.com/2017/10/cleveland-clinic-unveils-top-medical-innovations-2018/?ref=fr-title',
  'http://www.24x7mag.com/2017/11/global-medical-imaging-device-market-slated-reach-74-billion'
]

const getCategories = (url) => {
  const options = {
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
      sendImmediately: false
    },
    uri: 'https://watson-api-explorer.mybluemix.net/natural-language-understanding/api/v1/analyze',
    qs: {
        url: url,
        version: '2017-02-27',
        features: 'categories'
    },
    json: true
  }

  return rpn(options)
    .then((data) => {
      return data.categories
    })
    .catch((err) => {
      console.log('err', err)
    })
}

async.each(urls, (url, cb) => {
  getCategories(url)
    .then((categories) => {
      categories.forEach((category) => {
        console.log('category', category)
      })

      cb()
    })
}, (err) => {
  if (err) {
    console.log('error', err)
  }
})
