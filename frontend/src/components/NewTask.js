import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NewTask.css';

const NewTask = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Usuário não autenticado.');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/tasks', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMessage('Tarefa criada com sucesso!');
      setMessageType('success');
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setMessage(
        error.response?.data?.message || 
        'Erro ao criar tarefa. Tente novamente.'
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="newtask-container">
      <h2>Criar Nova Tarefa</h2>
      
      {message && (
        <div className={`status-message status-${messageType}`}>
          {message}
        </div>
      )}

      <form className="newtask-form" onSubmit={handleSubmit}>
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

        <div className="form-buttons">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Tarefa'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTask;