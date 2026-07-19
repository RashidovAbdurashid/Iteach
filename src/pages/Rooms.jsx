import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "../styles/Students.css";

const API_URL = "http://localhost:5000/rooms";

function Rooms() {
  const [roomsList, setRoomsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({ name: "" });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serverdan javob olishda xatolik!");
      const data = await response.json();
      setRoomsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openModal = (type, room = null) => {
    setModal({ type, data: room });
    if (type === "edit" && room) {
      setForm({ name: room.name || "" });
    } else {
      setForm({ name: "" });
    }
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Название комнаты обязательно!");
      return;
    }

    try {
      if (modal.type === "create") {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Qo'shishda xatolik yuz berdi");
        const newRoom = await response.json();
        setRoomsList((prev) => [...prev, newRoom]);
      } else if (modal.type === "edit") {
        const response = await fetch(`${API_URL}/${modal.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Tahrirlashda xatolik yuz berdi");
        const updatedRoom = await response.json();
        setRoomsList((prev) =>
          prev.map((r) => (r.id === modal.data.id ? updatedRoom : r)),
        );
      }
      closeModal();
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      alert("Amalni bajarishda xatolik yuz berdi!");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/${modal.data.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setRoomsList((prev) => prev.filter((r) => r.id !== modal.data.id));
        closeModal();
      } else {
        alert("O'chirishda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
    }
  };

  const filteredRooms = roomsList.filter((r) => {
    if (!r) return false;
    return (r.name || "").toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <h2 className="table-title">Комнаты</h2>
        <button
          className="btn-confirm btn-add"
          onClick={() => openModal("create")}
        >
          <FiPlus style={{ marginRight: "6px", fontSize: "16px" }} /> Добавить
          комнату
        </button>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th> название </th>
              <th style={{ textAlign: "right", paddingRight: "24px" }}>
                Действия
              </th>
            </tr>

            <tr className="filter-row">
              <td></td>
              <td>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск по названию..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </td>
              <td style={{ textAlign: "right", paddingRight: "30px" }}>
                <FiSearch className="search-icon" />
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Загрузка данных...
                </td>
              </tr>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room, index) => (
                <tr key={room.id} className="row-normal">
                  <td>{index + 1}</td>
                  <td className="fw-600">{room.name}</td>
                  <td>
                    <div
                      className="table-actions"
                      style={{
                        justifyContent: "flex-end",
                        paddingRight: "8px",
                      }}
                    >
                      <button
                        className="btn-act clr-blue"
                        onClick={() => openModal("edit", room)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-act clr-red"
                        onClick={() => openModal("delete", room)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#6b7280",
                  }}
                >
                  Нет подходящих комнат
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.type && modal.type !== "delete" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>
              {modal.type === "create"
                ? "Добавить комнату"
                : "Редактирование комнаты"}
            </h3>

            <div style={{ marginBottom: "24px" }}>
              <label className="modal-label">Название комнаты</label>
              <input
                type="text"
                className="modal-input-field"
                value={form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder="Например: Study room 1"
              />
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={handleSave}>
                {modal.type === "create" ? "Добавить" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "delete" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Удаление комнаты</h3>
            <p>Вы уверены, что хотите удалить эту комнату?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-confirm danger" onClick={handleDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rooms;
