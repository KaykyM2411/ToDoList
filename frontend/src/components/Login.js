import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importa o hook useNavigate
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Inicializa o hook de navegação

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });

      const { token } = response.data;

      // Salva o token no localStorage
      localStorage.setItem('token', token);

      setMessage('Login bem-sucedido!');

      // Passa o token para o App.js
      onLoginSuccess(token);
    } catch (error) {
      setMessage(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Erro no login. Credenciais inválidas.'
      );
      console.error('Erro no login:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Entrar</button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Botão para ir para a tela de registro */}
      <div className="register-link-container">
        <p>Não tem uma conta?</p>
        <button className="create-account-button" onClick={() => navigate('/register')}>
          Crie sua conta
        </button>
      </div>
    </div>
  );
}

export default Login;