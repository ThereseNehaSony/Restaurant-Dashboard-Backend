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
