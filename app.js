const path=require('path')
const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const morgan=require('morgan')
const exphbs=require('express-handlebars')
const methodOverride=require('method-override') // Because we want to override put request in form 
const passport=require('passport')
const session=require('express-session')   //In order to passport work with session we required express-session
const MongoStore=require('connect-mongo') //It will help us to store the sessions in database
const connectDB = require('./config/db') // For connecting the databse


const app=express()
//body parse
app.use(express.urlencoded({extended:false})) //so that we could work wih form data
app.use(express.json())

//Methods
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


//load config
dotenv.config({path: './config/config.env'})
/*The purpose of this code is to load environment variables from a file called "config.env" 
located in a folder called "config". The "dotenv" library allows you to manage configuration
variables for your application, such as database credentials or API keys, by loading them from
a file on the file system instead of hard-coding them into the application code.*/


// CONNECTING NODE.JS application with database using mongoose
connectDB()


//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,         //We dont wanna save a session if nothing is modified
    saveUninitialized: false, //Don't create a session until something is stored
    //cookie: { secure: true }
    store:MongoStore.create({mongoUrl:process.env.MONGO_URL})
    
  }))


//passport config
require('./config/passport')(passport)


//logging
if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'))
}
/*The morgan module is a popular HTTP request logger middleware for Node.js.
It allows you to log incoming HTTP requests in a format that is easily readable
 and useful for debugging and monitoring the behavior of your application*/



//Handlebars Helpers
const { formatDate, stripTags,  truncate, editIcon,select }=require('./helpers/hbs') 

/*The formatDate, stripTags, truncate,editIcon, and select functions are being 
imported from the specified module and can be used within the current file*/

const { request } = require('http')

//handlebars
app.engine('.hbs',exphbs.engine({ helpers:{
//So that we can use these helpers
formatDate,
stripTags,
truncate,
editIcon,
select
}, defaultLayout:'main', extname: '.hbs'})) //exphbs is constant so we have to call engine function from exphbs
                                                                        // thats why we have used exphbs.engine()
app.set('view engine','.hbs') // We are using 'hbs' template here, so we have to save it first

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req,res,next)
{
  res.locals.user=req.user||null
  next()
}
)
//Static folders
app.use(express.static(path.join(__dirname,'public')))


//routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT= process.env.PORT || 5000
app.listen(PORT,console.log('Server running in', process.env.NODE_ENV ,'mode on port' ,PORT))