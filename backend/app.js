require('dotenv').config()

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');

const User = require('./models/User');
const Note = require('./models/Note');

const app = express();
app.use(express.json());

//Rota publica
app.get('/', (req, res) => {
    res.json({msg: "hello, world"})
})

//Se registrar
app.post('/auth/signup', async (req, res) => {
    const { email, password, confirm_password } = req.body;

    if(!email || !password || !confirm_password){
        return res.status(422).json({ msg: "Preencha todos os campos corretamente!"});
    }

    if (password != confirm_password){
        return res.status(422).json({ msg: "As senhas não conferem!" })
    }

    //Checando se o email ja esta registrado
    const emailExists = await User.findOne({ email });

    if(emailExists){
        return res.status(422).json({ msg: "Esse email ja esta cadastrado, utilize outro email"})
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criando um usuario
    const user = new User({
        email,
        password: passwordHash
})

    try{
        user.save()

        const secret_key = process.env.secret_key
        const token = jwt.sign({
            id: user._id
        }, secret_key)

        res.status(201).json({msg: "Conta criada com sucesso", token, user_id: user._id})
    } catch(error){
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" })
        console.log(error)
    }
})

//Logar na conta
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        return res.status(422).json({ msg: "Preencha todos os campos corretamente!"});
    }

    const user = await User.findOne({email})

    if(!user){
        res.status(404).json({ msg: "Esse email ainda nao esta cadastrado! "})
    }

    const checkPass = await bcrypt.compare(password, user.password)

    if(!checkPass){
        return res.status(422).json({ msg: "A senha esta incorreta! "})
    }

    try{
        const secret_key = process.env.secret_key

        const token = jwt.sign({
            id: user._id
        }, secret_key);

        res.status(200).json({ 
            msg: "Autenticação realizada com sucesso",
            token,
            user_id: user._id
        })

    } catch(error){
        res.status(500).json({ msg: "Ocorreu um erro no servidor, tente novamente mais tarde."});
        console.log(error);
    }

})

//Rota com autenticação
app.get('/api/notes', verifyToken, async (req, res) => {
    const userId = req.userId
    const notes = await Note.find({ userId }, '-userId');

    if(!notes){
        return res.status(422).json({ msg: "Nenhuma nota encontrada"});
    }
    
    res.status(200).json({ notes });
})

app.post('/api/notes', verifyToken, async (req, res) => {
    const { title, content } = req.body;
    const userId = req.userId
    const newNote = new Note({title, content, userId});

    try{
        newNote.save()
        res.status(201).json({ msg: "Nota criada com sucesso!", noteId: newNote._id})
    } catch(error){
        res.status(500).json({ msg: "Ocorreu um erro no servidor tente novamente mais tarde." })
        console.log(error)
    }
})

app.get('/api/notes/:id', verifyToken, async (req, res) => {
    const userId = req.userId
    const noteId = req.params.id

    const note = await Note.findById(noteId)

    if (userId != note.userId){
        return res.status(400).json({ msg: "Acesso negado!" })
    }

    res.status(200).json({ note })

})

app.delete('/api/notes/:id', verifyToken, async (req, res) => {
    const userId = req.userId
    const noteId = req.params.id

    const note = await Note.findById(noteId)

    if (!note){
        return res.status(422).json({ msg: "Nao existe nenhuma nota com esse id"})
    }

    if (userId != note.userId){
        return res.status(400).json({ msg: "Acesso negado!" });
    }

    try{
        await Note.findByIdAndDelete(noteId);
        res.status(202).json({ msg: "A nota foi excluida com sucesso!" });
    } catch(error){
        res.status(500).json({ msg: "Ocorreu um erro no servidor, tente novamente mais tarde." })
        console.log(error)
    }
})

app.put('/api/notes/:id', verifyToken, async (req, res) => {
    const {title, content} = req.body
    const userId = req.userId;
    const noteId = req.params.id;

    const note = await Note.findById(noteId)

    if(!note){
        return res.status(422).json({ msg: "A nota nao existe."})
    }

    if (userId != note.userId){
        return res.status(400).json({ msg: "Acesso negado."})
    }

    try{
        await Note.findByIdAndUpdate(noteId, {title, content}, {new: true})
        res.status(204).send()
    } catch (error){
        res.status(500).json({ msg: "Ocorreu um erro no servidor, tente novamente mais tarde."})
        console.log(error)
    }
})

function verifyToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(422).json({ msg: "Um token de autenticação é necessario para acessar essa rota" })
    }

    try{
        const secret_key = process.env.secret_key;

        req.userId = jwt.verify(token, secret_key).id;

        next()

    } catch(error){
        res.status(400).json({ msg: "Token invalido" })
    }
    
    
}

const user_db = process.env.DB_USER;
const pass_db = process.env.DB_PASS;

mongoose.connect(
    `mongodb+srv://${user_db}:${pass_db}@notes.plsho.mongodb.net/?retryWrites=true&w=majority&appName=Notes`)
    .then(() => {console.log("Conectado ao banco de dados")});
    
app.listen(4000, () => {
    console.log("Servidor rodando em: localhost:4000");
})