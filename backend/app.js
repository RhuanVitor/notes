const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.json({msg: "hello, world"})
})

app.post('/auth/login', (req, res) => {
    
})

app.post('/auth/signup', (req, res) => {

})

app.listen(4000, () => {
    console.log("Servidor rodando em: localhost:4000")
})