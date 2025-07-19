const Curso = require('../models/curso');

// @desc    Obter todos os cursos
// @route   GET /api/cursos
exports.getCursos = async (req, res) => {
  try {
    const cursos = await Curso.find().populate('instructor', 'name');
    res.json(cursos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Criar novo curso
// @route   POST /api/cursos
exports.createCurso = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    const newCurso = new Curso({
      title,
      description,
      price,
      instructor: req.user.id
    });

    const curso = await newCurso.save();
    res.json(curso);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Atualizar curso
// @route   PUT /api/cursos/:id
exports.updateCurso = async (req, res) => {
  const { title, description, price } = req.body;

  try {
    let curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }

    // Verificar se o usuário é o instrutor ou admin
    if (curso.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Usuário não autorizado' });
    }

    curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, price } },
      { new: true }
    );

    res.json(curso);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// @desc    Excluir curso
// @route   DELETE /api/cursos/:id
exports.deleteCurso = async (req, res) => {
  try {
    let curso = await Curso.findById(req.params.id);

    if (!curso) {
      return res.status(404).json({ msg: 'Curso não encontrado' });
    }

    // Verificar se o usuário é o instrutor ou admin
    if (curso.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Usuário não autorizado' });
    }

    await Curso.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Curso removido' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};