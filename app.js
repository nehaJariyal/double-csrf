const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const { doubleCsrf } = require('csrf-csrf');

const app = express();
const port = 4000;

// Define options for double CSRF protection

const doubleCsrfOptions = {
  getSecret: (req) => req.session.csrfSecret,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    rotection: "strict",
    secure: process.env.NODE_ENV === "production",
  },
  size: 32,
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
};



const {
  generateToken, 
  doubleCsrfProtection 
} = doubleCsrf(doubleCsrfOptions)



// Set up session middleware
app.use(session({
  secret: 'csrftoken',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(doubleCsrfProtection);        //protection 


app.get("/csrf-token", (req, res) => {
  const csrfToken = generateToken(req, res);
  console.log(csrfToken);
  
  res.json({ csrfToken });
});


app.post('/submit', (req, res) => {
  res.send('Form submitted successfully');
  console.log('Form submitted successfully');
  
});


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



 