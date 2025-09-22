import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditTask.css'; 

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    completed: false
  });

  const fetchTask = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Usuário não autenticado.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const task = response.data.task;
      setFormData({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date ? task.due_date.slice(0, 16) : '', // Formata para datetime-local
        completed: task.completed
      });
    } catch (error) {
      setMessage('Erro ao carregar tarefa.');
      setMessageType('error');
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Usuário não autenticado.');
      setMessageType('error');
      setSaving(false);
      return;
    }

    try {
      await axios.put(`http://localhost:3000/api/tasks/${id}`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Tarefa atualizada com sucesso!');
      setMessageType('success');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate(`/tarefa/${id}`);
      }, 2000);

    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setMessage(
        error.response?.data?.message || 
        'Erro ao atualizar tarefa. Tente novamente.'
      );
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/tarefa/${id}`);
  };

  if (loading) return <div className="status-message">Carregando tarefa...</div>;

  return (
    <div className="edit-task-container">
      <h2>Editar Tarefa</h2>
      
      {message && (
        <div className={`status-message status-${messageType}`}>
          {message}
        </div>
      )}

      <form className="edit-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Digite o título da tarefa"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva a tarefa (opcional)"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Prazo *</label>
          <input
            type="datetime-local"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="completed" className="checkbox-label">
            <input
              type="checkbox"
              id="completed"
              name="completed"
              checked={formData.completed}
              onChange={(e) => setFormData({...formData, completed: e.target.checked})}
            />
            Tarefa concluída
          </label>
        </div>

        <div className="form-buttons">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={handleCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;