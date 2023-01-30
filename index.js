const app = require('./api/app')

const port = process.env.PORT || 3001

// listens on port 3000
app.listen(port, () => {
  console.log(`Web app listening at http://localhost:${port}`)
})