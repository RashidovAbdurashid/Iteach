import React, { useState } from "react";
import "../styles/Home.css";

function Profile() {
  const [adminName, setAdminName] = useState("Администратор");
  const [email, setEmail] = useState("admin@iteach.uz");
  const [phone, setPhone] = useState("+998 90 123 45 67");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Данные профиля успешно обновлены!");
  };

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <h3 className="table-title">Профиль администратора</h3>
      </div>

      <div className="home-table-container" style={{ padding: "24px" }}>
        <form
          onSubmit={handleSave}
          style={{
            maxWidth: "500px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${adminName}&background=0284c7&color=fff&size=80`}
              alt="Avatar"
              style={{ borderRadius: "50%" }}
            />
            <div>
              <h4 style={{ margin: 0, fontSize: "18px" }}>{adminName}</h4>
              <span className="text-muted">Главный администратор</span>
            </div>
          </div>

          <div>
            <label className="modal-label">Имя и Фамилия</label>
            <input
              type="text"
              className="modal-input"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="modal-label">Электронная почта</label>
            <input
              type="email"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="modal-label">Номер телефона</label>
            <input
              type="text"
              className="modal-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div style={{ marginTop: "8px" }}>
            <button type="submit" className="btn-confirm">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
