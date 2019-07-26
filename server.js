const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 4000;

// Controllers
const ctrl = require('./controllers');

// ----------------------------- MIDDLEWARE ----------------------------- //
// Protect Headers
app.use(helmet());

//  Express Session Config
app.use(session({
secret: process.env.SESSION_SECRET || 'Elephant poker championships',
resave: false,
saveUninitialized: false,
}));

// BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cors
const corsOptions = {
origin: ['http://127.0.0.1:5500'],
credentials: true,
optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// ----------------------------- HTML ENDPOINT ----------------------------- //

// GET Root Route
app.get('/', (req, res) => res.send('<h1>Welcome to Hackton Team 3 API</h1>'));

// ----------------------------- API ENDPOINT ----------------------------- //

// Auth Routes
app.use('/api/auth', ctrl.auth);
// Users Routes
app.use('/api/users', ctrl.users);

// ----------------------------- START SERVER ----------------------------- //

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
