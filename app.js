var express=require('express');
var path=require('path');
var cookieParser=require('cookie-parser');
var bodyParser=require('body-parser');
var exphbs=require('express-handlebars');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var session=require('express-session');
var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo=require('mongodb');
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/loginapp',{ useNewUrlParser: true });
var db=mongoose.connection;

//check connection
db.once("open",function(){
  console.log('connected to Mongodba')
})

var routes=require("./routes/index");
var users=require('./routes/users');

// init an app
var app=express();

// Set view engine
app.set('views',path.join(__dirname,"views"));//tell views folder to handle the view
app.engine('handlebars',exphbs({defaultLayout:'layout'}));//by default, there are a layouts folder set under the views folder
app.set('view engine','handlebars');



//middleware body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
app.use(express.static(path.join(__dirname,'public')));

//Express session
app.use(session({
    secret:"keyboard cat",
    saveUninitialized:true,
    resave:true
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

//express validator Middleweare
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  //Connect flash
  app.use(flash());

  //Set global variable, add variable to the local object in a general middlewarem , it make handlebars is accessable to the gobal variable
  app.use(function(req,res,next){
      res.locals.success_msg=req.flash('success_msg');
      res.locals.err_msg=req.flash('error_msg');
      res.locals.error=req.flash('error');//passport set it is own flash error message
      res.locals.user=req.user||null;
      next();
  })

  app.use('/',routes);
  app.use('/users',users);

  //set port
  app.set('port',(process.env.PORT||3000));

  app.listen(app.get('port'),function(){
   console.log('Server started on port'+app.get('port'));
  })