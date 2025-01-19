const mongoose = require('mongoose');

const connectDB = () => {
    const user_db = process.env.DB_USER;
    const pass_db = process.env.DB_PASS;

    mongoose.connect(
        `mongodb+srv://${user_db}:${pass_db}@notes.plsho.mongodb.net/?retryWrites=true&w=majority&appName=Notes`
    ).then(() => {
        console.log("Conectado ao banco de dados");
    }).catch((err) => {
        console.error("Erro ao conectar ao banco de dados", err);
    });
};

module.exports = { connectDB };
