const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    const userId = req.userId
    const notes = await Note.find({ userId }, '-userId');

    if(!notes){
        return res.status(422).json({ msg: "Nenhuma nota encontrada"});
    }
    
    res.status(200).json({ notes });
}

exports.createNote = async (req, res) => {
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
}

exports.getNote = async (req, res) => {
    const userId = req.userId
    const noteId = req.params.id

    const note = await Note.findById(noteId)

    if (userId != note.userId){
        return res.status(400).json({ msg: "Acesso negado!" })
    }

    res.status(200).json({ note })

}

exports.deleteNote = async (req, res) => {
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
}

exports.updateNote = async (req, res) => {
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
}