require('dotenv').config()

const mongoose = require('mongoose');
const express = require('express');

const { connectDB } = require('./config/database');

const authRoutes = require('./routes/authRoutes')
const noteRoutes = require('./routes/noteRoutes')

const app = express();
app.use(express.json());

app.use('/auth', authRoutes)
app.use('/api/notes', noteRoutes)

connectDB();

app.listen(4000, () => {
    console.log("Servidor rodando em: localhost:4000");
})