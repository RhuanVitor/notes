const jwt = require('jsonwebtoken');

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

module.exports = verifyToken;