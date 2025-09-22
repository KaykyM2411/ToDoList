import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './TaskList.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const controller = new AbortController();

    const fetchOpenTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await axios.get('http://localhost:3000/api/tasks?status=open', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        setTasks(response.data.tasks || []);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log('Requisição cancelada:', err.message);
        } else {
          setError(
            err.response && err.response.data && err.response.data.message
              ? err.response.data.message
              : 'Erro ao buscar tarefas.'
          );
          setLoading(false);
        }
      }
    };

    fetchOpenTasks();

    return () => {
      controller.abort();
    };
  }, []);

  // Função para lidar com o clique em uma tarefa
  const handleTaskClick = (taskId) => {
    navigate(`/tarefa/${taskId}`);
  };

  if (loading) return <div className="status-message">Carregando tarefas...</div>;
  if (error) return <div className="status-message">Erro: {error}</div>;

  return (
    <div className="tasklist-container">
      <h2>Tarefas Abertas</h2>
      {tasks.length === 0 ? (
        <div className="no-tasks-message">
          <div className="no-tasks-icon">📝</div>
          <p className="no-tasks-text">
            Nenhuma tarefa aberta encontrada.<br />
            Que tal criar sua primeira tarefa?
          </p>
        </div>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li 
              key={task.id} 
              className="task-item"
              onClick={() => handleTaskClick(task.id)} // Adicionar evento de clique
            >
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Prazo: {new Date(task.due_date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;