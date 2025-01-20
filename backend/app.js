require('dotenv').config()

const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/database');

const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')

const app = express();
app.use(express.json());
app.use(cors())

app.use('/auth', authRoutes)
app.use('/api/notes', noteRoutes)

connectDB();

app.listen(4000, '0.0.0.0', () => {
    console.log("Servidor rodando em: localhost:4000");
})