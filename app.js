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
      throw new Error(err.message)
    })
}

const addScores = (results, data) => {
  const existingIndex = results.map((data) => data.label).indexOf(data.label);

  if (existingIndex !== -1) {
    results[existingIndex] = Object.assign({}, results[existingIndex], {score: results[existingIndex].score + data.score})
  } else {
    results.push(data)
  }
}

const results = []

async.each(urls, (url, cb) => {
  getCategories(url)
    .then((categories) => {
      categories.forEach((category) => {
        addScores(results, category)
      })

      cb()
    })
    .catch((err) => {
      cb(err)
    })
}, (err) => {
  if (err) {
    console.log('Error fetching scores - ', err)
  } else {
    console.log(JSON.stringify(results))
  }
})
