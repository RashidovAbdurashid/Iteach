import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("username");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("isAuth", "true");
        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        toast.success("Tizimga muvaffaqiyatli kirdingiz!");
        navigate("/home");
      } else {
        toast.error(data.message || "Login yoki parol xato!");
      }
    } catch (error) {
      console.error("Login xatoligi:", error);
      toast.error("Server bilan bog'lanishda xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };

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

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Kirilmoqda..." : "Kirish"}
        </button>
      </form>
    </div>
  );
}

export default Login;
