import express from 'express'

void (async () => {
  try {
    const expressApp = express()
    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    expressApp.listen(3000, () => {
      console.info('Listening at http://localhost:3000')
    })
  } catch (error) {
    console.error(error)
  }
})()
