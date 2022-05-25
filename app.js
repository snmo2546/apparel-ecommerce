const express = require('express')
const { engine } = require('express-handlebars')
const session = require('express-session')

const routes = require('./routes')
const passport = require('./config/passport')

const app = express()
const port = 3000

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: 'ThisIsMySecret', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use(routes)

app.listen(port, () => {
  console.log(`Apparel Ecommerce listening on port ${port}`)
})