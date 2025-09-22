const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Rota para CRIAR uma nova tarefa (POST /api/tasks)
router.post('/', async (req, res) => {
    const { title, description, due_date } = req.body;
    const userId = req.userId;

    try {
        const newTask = await pool.query(
            'INSERT INTO tasks (title, description, due_date, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, due_date, userId]
        );
        res.status(201).json({ message: 'Tarefa criada com sucesso!', task: newTask.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/tasks?status=open
// GET /api/tasks?status=closed
// GET /api/tasks (todas)
router.get('/', async (req, res) => {
  const userId = req.userId;
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params = [userId];

    if (status === 'open') {
      query += ' AND completed = false';
    } else if (status === 'closed') {
      query += ' AND completed = true';
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Nenhuma task encontrada.' });
    }

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error('Erro ao buscar tasks:', error);
    res.status(500).json({ message: 'Erro no servidor ao buscar tasks.' });
  }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const task = await pool.query(
            'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
            [id, userId]
        );
        if (task.rows.length === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada.' });
        }
        res.status(200).json({ task: task.rows[0] }); 
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}); 


// Rota para ATUALIZAR uma tarefa (PUT /api/tasks/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const { title, description, due_date, completed } = req.body;

    try {
        const updateTask = await pool.query(
            'UPDATE tasks SET title = $1, description = $2, due_date = $3, completed = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [title, description, due_date, completed, id, userId]
        );

        if (updateTask.rows.length === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para editá-la.' });
        }

        res.status(200).json({ message: 'Tarefa atualizada com sucesso!', task: updateTask.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rota para DELETAR uma tarefa (DELETE /api/tasks/:id)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    try {
        const deleteTask = await pool.query(
            'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (deleteTask.rows.length === 0) {
            return res.status(404).json({ message: 'Tarefa não encontrada ou você não tem permissão para deletá-la.' });
        }

        res.status(200).json({ message: 'Tarefa deletada com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;