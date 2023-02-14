require('dotenv').config();
require('./models/database').connect();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const User = require('./models/user');
const ejs = require('ejs');
const nodemailer = require('nodemailer');


const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: 'mongodb+srv://admin-femi:oluwafemi@cluster0.ulvxftn.mongodb.net/bibleDB'
    })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Home Routes ///////////////////////////////////////////////
app.get('/', (req, res) => {
    res.render('home');
}) 

app.get('/home', (req, res) => {
    if(req.isAuthenticated){
        res.render('word', {welcome: ''});
    }
})

// Register Route ////////////////////////////////////////////////////
app.get('/register', (req, res) => {
    res.render('register', {msg: ''});
});


app.post('/register',   (req, res) => {
    const {name, email, password} = req.body;

     User.findOne({ email }, (err, oldUser) => {
        if (oldUser) {
            res.render("signin", {msg: 'please login, you\'re already Registered'});
       } else {
        User.register({
            username: name,
            email: email,
        }, password, (err, user) => {
            if(err){
                console.log(err);
                res.render('register', {msg: 'Probably the Username Already Exists'})
            } else {
                passport.authenticate('local', {failureRedirect: '/register'});
                res.render('word', {welcome: `Welcome ${user.username}`});   

                const output = `<h1>Congratulations</h1>
                    <h3>The person with the following Details:</h3>
                    <ul>
                    <li>Name: ${req.body.name} </li>
                    <li>Email: ${req.body.email} </li>
                     </ul>
                     <h3>Just Signed with Us</h3>
                     <h4>Enjoy our App</h4>
    `;

    async function main() {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
         service: 'hotmail',
          auth: {
            user: 'bossfemzy10@outlook.com',
            pass: process.env.EMAIL_PASSWORD
          },
          tls: {
            rejectUnauthorized: false,
          }
        });

        let info = await transporter.sendMail({
            from: 'bossfemzy10@outlook.com', // sender address
            to: email, // list of receivers
            subject: "ThyWord signin", // Subject line
            text: "Welcome", // plain text body
            html: output // html body
          });
        
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
        
        main().catch(console.error);
            }
        })
       }
     });

})

// Login Route //////////////////////////////////////////////////////
app.get('/login', (req, res) => {
    res.render('signin', {msg: ''});
});

app.post('/login', (req, res) => {
    const {email} = req.body;

    User.findOne({email: email}, (err, foundUser) => {
       if(err){
            res.json({error})
            console.log(err)
       } else {
            if(!foundUser){
            res.render('register', {msg: 'Please Register'})
        } else {
            req.login(foundUser, (err) => {
                if(err){
                    console.log(err);
                } else {
                    passport.authenticate('local', {failureRedirect: '/login'});
                    res.render('word', {welcome: `Welcome ${foundUser.username}`});    
                }
            })
        }
       }
    })
    
});


// logout route /////////////////////////////////////////////////////

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err){
            console.log(err)
        } else {
            res.redirect('/');
            console.log('logged out Successfully');
        }
    });

})


module.exports = app;