require('dotenv').config();

const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const tasksRoutes = require('./routes/tasksRoutes');


// Middleware
app.use(cors({ origin: 'http://localhost:3001' })); 


app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
    res.send('API de To-do List está rodando!');
});

// Rotas
app.use('/auth', authRoutes);
app.use('/api/tasks', tasksRoutes);

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
