const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');

exports.signup = async (req, res) => {
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

        res.status(201).json({msg: "Conta criada com sucesso", token})
    } catch(error){
        res.status(500).json({ msg: "Aconteceu um erro no servidor, tente novamente mais tarde" })
        console.log(error)
    }
}

exports.login = async (req, res) => {
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
        })

    } catch(error){
        res.status(500).json({ msg: "Ocorreu um erro no servidor, tente novamente mais tarde."});
        console.log(error);
    }

}