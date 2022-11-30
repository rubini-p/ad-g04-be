// const express = require('express');
// const keys = require('./configs/keys');
// const mongoose = require('mongoose');
// const cookieSession = require('cookie-session');
// const passport = require('passport');
// require('./models/user');
// require('./service/passport');
// mongoose.connect(keys.mongoURI);
// const app = express();

// app.use(cookieSession({
//         maxAge: 30 * 24 * 60 * 60 * 1000,
//         keys: [keys.cookieKey],
//     }));

// app.use(passport.initialize());
// app.use(passport.session());

// require('./routes/authRoutes')(app);

// app.listen(process.env.PORT || 3000);