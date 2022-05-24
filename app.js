const express = require('express')
const { engine } = require('express-handlebars')

const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.get('/', (req, res) => {
  res.send('Hello Apparel Ecommerce Site :)')
})

app.listen(port, () => {
  console.log(`Apparel Ecommerce listening on port ${port}`)
})