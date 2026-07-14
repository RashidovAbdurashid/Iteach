import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  let navigate = useNavigate();

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");

function handleLogin(event) {
  event.preventDefault();

  if (username === "admin" && password === "admin123") {

    localStorage.setItem("isAuth", "true");

    toast.success("Tizimga muvaffaqiyatli kirdingiz!");
    navigate("/home");
  } else {
    toast.error("Login yoki parol xato!");
  }
}

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Tizimga kirish</h2>

        <label>Login</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Loginni kiriting"
          required
        />

        <label>Parol</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Parolni kiriting"
          required
        />

        <button type="submit" className="login-btn">
          Kirish
        </button>
      </form>
    </div>
  );
}

export default Login;
