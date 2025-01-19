const noteController = require('../controllers/noteController');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, noteController.getNotes);
router.post('/', verifyToken, noteController.createNote);
router.get('/:id', verifyToken, noteController.getNote);
router.put('/:id', verifyToken, noteController.updateNote);
router.delete('/:id', verifyToken, noteController.deleteNote);

module.exports = router