import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidCPF } from "./cpfValidation";
import { criarUsuarioNoFirestore } from "../services/AuthService";
import styled from "styled-components";
import LoginButton from "../StyledComponents/ButtonLogin";

const RegisterButton = styled(LoginButton)`
  padding: 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #808080;
  }
`;

const RegisterComponent = () => {
  const navigate = useNavigate(); // Hook para navegação
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
  
    if (!name || !email || !password || !confirmPassword || !cpf) {
      setError("Preencha todos os campos");
      return;
    }
  
    if (password !== confirmPassword) {
      setError("As senhas nao coincidem");
      return;
    }
  
    if (!isValidCPF(cpf)) {
      setError("CPF invalido");
      return;
    }
  
    try {
      const response = await criarUsuarioNoFirestore(email, password);
      if (response.success) {
        setSuccessMessage("Registro feito com sucesso");
        setError(""); 
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        setError("Erro ao criar usuário: " + response.errorCode);
        setSuccessMessage("");
      }
    } catch (error) {
      setError("Falha ao fazer o registro");
      setSuccessMessage("");
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1>Registre-se</h1>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            style={styles.input}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={styles.input}
          />
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="CPF"
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            style={styles.input}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme sua Senha"
            style={styles.input}
          />
          {error && <div style={styles.errorMessage}>{error}</div>}
          {successMessage && (
            <>
              <div style={styles.successMessage}>{successMessage}</div>
              <p>Login feito com sucesso</p>
            </>
          )}
          <div style={styles.containerButton}>
            <RegisterButton type="submit">Registrar</RegisterButton>
          </div>
        </form>
        <p
          style={styles.switchLink}
          onClick={() => navigate("/login")} // Usando navigate para redirecionar
        >
          Já tem uma conta?<strong> Entre</strong>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(-45deg, #2F4F4F, #696969, #808080, #D3D3D3)",
    animation: "gradient 6s ease infinite",
    backgroundSize: "400% 400%",
  },
  formContainer: {
    backgroundColor: "#3c3c3c",
    padding: "40px 30px",
    borderRadius: "10px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
    color: "#fff",
    width: "100%",
    maxWidth: "350px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px", 
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    backgroundColor: "#f5f5f5",
    fontSize: "16px",
    outline: "none",
    boxSizing: "border-box",
  },
  containerButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "10px",
    fontSize: "16px",
    margin: "10px 0",
  },
  errorMessage: {
    color: "#ff4d4d",
    fontSize: "16px",
    margin: "10px 0",
  },
  switchLink: {
    color: "#fff",
    cursor: "pointer",
    marginTop: "20px",
    textDecoration: "underline",
  },
};

export default RegisterComponent;
