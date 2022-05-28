require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const { isLoggedIn } = require('./middleware');
const flash = require('connect-flash');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const Chat = require('./models/chat');

const port = process.env.PORT || 5000;
const dbUri = process.env.DBURI;

// DB connection
mongoose.connect(dbUri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log("DB connected"))
    .catch(() => console.log(err));

// middlewares
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

// routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const chatRoutes = require('./routes/chatRoute');
const searchRoutes = require('./routes/searchRoutes');

//APIs
const postsApiRoute = require('./routes/api/posts');
const { profile } = require('console');
const { emit } = require('./models/user');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());     // entering the user into a session
passport.deserializeUser(User.deserializeUser()); // when the user logs out this will destroy the session

// flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.get('/', isLoggedIn, (req, res) => {
    // if the user is logged in then it will jump to the next function which here is (req, res)
    res.render('home');
})

// Using routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(chatRoutes);
app.use(searchRoutes);

// Using APIs
app.use(postsApiRoute);

// Socket
io.on('connection', (socket) => {
    console.log("Connection established");
})
io.on('connection', socket => {
    socket.on("send-msg", async (data) => {
        io.emit('recieved-msg', {
            user: data.user,
            msg: data.msg
        });
        await Chat.create({ content: data.msg, user: data.user });
    });
});

server.listen(port, () => {
    console.log("the server is up and running on port 5000");
})

