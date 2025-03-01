require('dotenv').config();
const express = require('express')
const app = express();
const expressLayout = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')
const session = require('express-session')


//Connect Database
const connectDB = require('./server/db/db')
const PORT = 5000 || process.env.PORT;
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'))

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),

  }));

app.use(express.static('public'));

//Template
app.use(expressLayout)
app.set('layout', './layouts/main.ejs')
app.set('view engine', 'ejs')

app.use('/', require('./server/routes/main.js'))
app.use('/', require('./server/routes/admin.js'))

connectDB().then(() =>{
    app.listen(PORT, ()=>{
        console.log(`Server connected to port ${PORT}....`);
    })
});    
