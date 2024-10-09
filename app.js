// const express = require('express');
// const dotenv = require('dotenv');
// const connectdb = require('./config/database');
// import bodyParser from 'body-parser';

// dotenv.config();

// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// connectdb();


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const connectdb = require('./config/database');
const router = require('./routes/orderRoutes'); 
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
    origin: 'http://localhost:3003',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/orders', router);

connectdb();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
