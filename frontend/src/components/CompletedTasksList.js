import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CompletedTasksList.css';

const CompletedTasksList = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCompletedTasks = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Usuário não autenticado.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/api/tasks?status=closed', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTasks(response.data.tasks);
            } catch (err) {
                setError('Erro ao carregar tarefas concluídas.');
                console.error('Erro:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedTasks();
    }, []);

    if (loading) return <div className="status-message">Carregando tarefas concluídas...</div>;
    if (error) return <div className="status-message status-error">{error}</div>;

    return (
        <div className="task-list-container">
            <h2>Tarefas Concluídas</h2>
            {tasks.length === 0 ? (
                <div className="status-message">Nenhuma tarefa concluída encontrada.</div>
            ) : (
                <ul className="task-list">
                    {tasks.map(task => (
                        <li key={task.id} className="task-item">
                            <Link to={`/tarefa/${task.id}`} className="task-link">
                                <span className="task-title-item">{task.title}</span>
                                <span className={`task-status status-${task.completed ? 'completed' : 'open'}`}>
                                    {task.completed ? 'Concluída' : 'Aberta'}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CompletedTasksList;