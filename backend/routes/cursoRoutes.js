const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
  getCursos,
  createCurso,
  updateCurso,
  deleteCurso
} = require('../controllers/cursoController');

// @route   GET api/cursos
// @desc    Obter todos os cursos
// @access  Public
router.get('/', getCursos);

// @route   POST api/cursos
// @desc    Criar novo curso
// @access  Private
router.post('/', auth, createCurso);

// @route   PUT api/cursos/:id
// @desc    Atualizar curso
// @access  Private
router.put('/:id', auth, updateCurso);

// @route   DELETE api/cursos/:id
// @desc    Excluir curso
// @access  Private
router.delete('/:id', auth, deleteCurso);

module.exports = router;