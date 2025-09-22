import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TaskDetail.css';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Usuário não autenticado.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTask(response.data.task);
            } catch (error) {
                setError('Erro ao carregar tarefa.');
                console.error('Erro:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [id]);

    const handleComplete = async () => {
        const token = localStorage.getItem('token');
        
        // Crie um objeto com a tarefa atualizada, definindo 'completed' para true.
        // Mantenha os outros campos (title, description, due_date) do estado atual.
        const updatedTask = {
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            completed: true
        };

        try {
            // Mude a requisição de .patch para .put
            // e envie o objeto updatedTask no corpo da requisição.
            await axios.put(`http://localhost:3000/api/tasks/${id}`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage('Tarefa marcada como concluída!');
            setMessageType('success');
            
            // Recarregar os dados da task após concluir
            const response = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTask(response.data.task);
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setMessage('Erro ao marcar tarefa como concluída.');
            setMessageType('error');
            console.error('Erro:', error.response || error);
        }
    };

    const handleEdit = () => {
        navigate(`/editar-tarefa/${id}`);
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setMessage('Tarefa excluída com sucesso!');
            setMessageType('success');
            setShowDeleteModal(false);
            
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (error) {
            setMessage('Erro ao excluir tarefa.');
            setMessageType('error');
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="status-message">Carregando tarefa...</div>;
    if (error) return <div className="status-message status-error">{error}</div>;
    if (!task) return <div className="status-message status-error">Tarefa não encontrada.</div>;

    return (
        <div className="taskdetail-container">
            <h2>Detalhes da Tarefa</h2>

            {message && (
                <div className={`status-message status-${messageType}`}>
                    {message}
                </div>
            )}

            <div className="task-info">
                <div className="task-field">
                    <span className="task-label">Título:</span>
                    <span className="task-value">{task.title}</span>
                </div>

                <div className="task-field">
                    <span className="task-label">Descrição:</span>
                    <span className="task-value">{task.description || 'Nenhuma descrição'}</span>
                </div>

                <div className="task-field">
                    <span className="task-label">Prazo:</span>
                    <span className="task-value">{formatDate(task.due_date)}</span>
                </div>

                <div className="task-field">
                    <span className="task-label">Status:</span>
                    <span className="task-value">
                        <span className={`task-status status-${task.completed ? 'completed' : 'open'}`}>
                            {task.completed ? 'Concluída' : 'Aberta'}
                        </span>
                    </span>
                </div>

                <div className="task-field">
                    <span className="task-label">Criada em:</span>
                    <span className="task-value">{formatDate(task.created_at)}</span>
                </div>
            </div>

            <div className="task-actions">
                <button 
                    className="btn-action btn-back"
                    onClick={() => navigate('/')}
                >
                    Voltar
                </button>

                {!task.completed && (
                    <button 
                        className="btn-action btn-complete"
                        onClick={handleComplete}
                    >
                        Concluir
                    </button>
                )}
                
                {!task.completed && (
                    <button 
                        className="btn-action btn-edit"
                        onClick={handleEdit}
                    >
                        Editar
                    </button>
                )}

                <button 
                    className="btn-action btn-delete"
                    onClick={() => setShowDeleteModal(true)}
                >
                    Excluir
                </button>
            </div>

            {showDeleteModal && (
                <div className="confirm-modal">
                    <div className="modal-content">
                        <h3>Confirmar exclusão</h3>
                        <p>Tem certeza que deseja excluir esta tarefa?</p>
                        <p>Esta ação não pode ser desfeita.</p>
                        <div className="modal-buttons">
                            <button 
                                className="btn-modal-cancel"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-modal-confirm"
                                onClick={handleDelete}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskDetail;