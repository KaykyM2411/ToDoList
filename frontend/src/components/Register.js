import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"; 

const Register = () => {
  const [email, setEmail] = useState(""); // mudou de username para email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // envia email em vez de username
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Usuário registrado com sucesso!");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(`❌ Erro: ${data.message || "Falha no registro"}`);
      }
    } catch (error) {
      setMessage("❌ Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar</h2>
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Digite seu email"
          />
        </div>

        <div className="form-group">
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Digite sua senha"
          />
        </div>

        <div className="form-group">
          <label>Confirmar Senha:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirme sua senha"
          />
        </div>

        <button type="submit">Registrar</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Register;
