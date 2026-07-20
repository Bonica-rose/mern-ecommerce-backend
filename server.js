const express = require('express')
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require('./config/dbConnection');

const errorHandler = require('./middleware/errorHandler')
const notFound = require('./middleware/notFound')

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL
];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

connectDB();
app.get('/', (req, res) => { 
    res.send('<h1>Backend application for an ecommerce application using the MERN Stack</h1>')
})

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening to the port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});