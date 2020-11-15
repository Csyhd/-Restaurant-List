const express = require('express')
const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')
const mongoose = (require('mongoose'))
const bodyParser = require('body-parser')
const RestaurantList = require('./models/restaurantList')
const app = express()
const port = 3000
const db = mongoose.connection

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://localhost/restaurant_2.0', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.log('mongodb error!!')
})
db.once('open', () => {
  console.log('mongodb connected')
})

app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.get('/restaurants/:restaurants_id', (req, res) => {
  const restaurant = restaurantList.results.find(restaurant => {
    return restaurant.id.toString() === req.params.restaurants_id
  })
  res.render('show', { restaurant: restaurant })
})

app.listen(port, () => {
  console.log('start')
})