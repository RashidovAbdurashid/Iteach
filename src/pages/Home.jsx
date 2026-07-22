import React, { useEffect, useState, useMemo } from "react";
import {
  FiCheckCircle,
  FiPhoneCall,
  FiUserX,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

import "../styles/Home.css";

const API_URL = "http://localhost:5000/students";

function Home() {
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Записи");

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: null,
    subject: "",
    name: "",
    phone: "",
    days: "",
    dob: "",
    time: "",
    note: "",
    status: "row-normal",
  });

  const [createModal, setCreateModal] = useState({
    isOpen: false,
    subject: "",
    name: "",
    phone: "",
    days: "",
    dob: "",
    time: "",
    note: "",
    status: "row-normal",
  });

  const tabs = ["Записи", "Пробный урок", "Новые группы"];

  const stats = useMemo(
    () => [
      {
        id: 1,
        label: "Обработанно",
        value: studentsList.filter((s) => s.status === "row-success").length,
        icon: <FiCheckCircle />,
        color: "st-blue",
      },
      {
        id: 2,
        label: "В обработке",
        value: studentsList.filter((s) => s.status === "row-normal").length,
        icon: <FiPhoneCall />,
        color: "st-purple",
      },
      {
        id: 3,
        label: "Отказы",
        value: studentsList.filter((s) => s.status === "row-danger").length,
        icon: <FiUserX />,
        color: "st-pink",
      },
      {
        id: 4,
        label: "Должники",
        value: studentsList.filter((s) => s.status === "row-warn").length,
        icon: <FiAlertTriangle />,
        color: "st-red",
      },
    ],
    [studentsList],
  );

  const fetchStudents = () => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сервера");
        return res.json();
      })
      .then((data) => {
        setStudentsList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openCreateModal = () => {
    setCreateModal({
      isOpen: true,
      subject: "",
      name: "",
      phone: "",
      days: "",
      dob: "",
      time: "",
      note: "",
      status: "row-normal",
    });
  };

  const closeCreateModal = () => {
    setCreateModal((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmCreate = () => {
    if (createModal.name.trim() !== "" && createModal.phone.trim() !== "") {
      const { isOpen, ...newStudent } = createModal;

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })
        .then((res) => res.json())
        .then((createdData) => {
          setStudentsList((prev) => [...prev, createdData]);
          closeCreateModal();
        })
        .catch((err) => console.error("Ошибка:", err));
    } else {
      alert("Имя ученика и Номер телефона обязательны для заполнения!");
    }
  };

  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, id });
  const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

  const confirmDelete = () => {
    fetch(`${API_URL}/${deleteModal.id}`, { method: "DELETE" })
      .then(() => {
        setStudentsList((prev) => prev.filter((s) => s.id !== deleteModal.id));
        closeDeleteModal();
      })
      .catch((err) => console.error("Ошибка:", err));
  };

  const openEditModal = (student) => {
    setEditModal({ isOpen: true, ...student });
  };

  const closeEditModal = () => {
    setEditModal((prev) => ({ ...prev, isOpen: false }));
  };

  const confirmEdit = () => {
    if (editModal.name.trim() !== "" && editModal.phone.trim() !== "") {
      const { isOpen, ...updatedStudent } = editModal;

      fetch(`${API_URL}/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      })
        .then((res) => res.json())
        .then((data) => {
          setStudentsList((prev) =>
            prev.map((student) => (student.id === data.id ? data : student)),
          );
          closeEditModal();
        })
        .catch((err) => console.error("Ошибка:", err));
    } else {
      alert("Имя ученика и Номер телефона обязательны!");
    }
  };

  return (
    <div className="home-container">
      <div className="home-stats">
        {stats.map((stat) => (
          <div key={stat.id} className="stat-box">
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-info">
              <span className="stat-title">{stat.label}</span>
              <span className="stat-number">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="table-header-bar">
        <h3 className="table-title">Список учеников</h3>
        <button className="btn-confirm btn-add" onClick={openCreateModal}>
          <FiPlus style={{ marginRight: "6px", fontSize: "16px" }} /> Добавить
          ученика
        </button>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Предметы</th>
              <th>Ученики</th>
              <th>Телефон</th>
              <th>Дни уроков</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Примечание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Загрузка...
                </td>
              </tr>
            ) : studentsList.length > 0 ? (
              studentsList.map((student, index) => (
                <tr key={student.id} className={student.status}>
                  <td>{index + 1}</td>
                  <td className="fw-600">{student.subject}</td>
                  <td>{student.name}</td>
                  <td>{student.phone}</td>
                  <td>{student.days}</td>
                  <td className="text-muted">{student.dob}</td>
                  <td className="text-muted">{student.time}</td>
                  <td className="text-muted">{student.note}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="btn-act clr-blue"
                        onClick={() => openEditModal(student)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-act clr-red"
                        onClick={() => openDeleteModal(student.id)}
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
                  colSpan="9"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  Нет данных
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="home-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tb-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {deleteModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Удаление ученика</h3>
            <p>
              Вы уверены, что хотите удалить этого ученика? Это действие
              необратимо.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Отмена
              </button>
              <button className="btn-confirm danger" onClick={confirmDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {createModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Добавить нового ученика</h3>
            <input
              type="text"
              className="modal-input"
              value={createModal.subject}
              onChange={(e) =>
                setCreateModal({ ...createModal, subject: e.target.value })
              }
              placeholder="Предмет (например: IELTS)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.name}
              onChange={(e) =>
                setCreateModal({ ...createModal, name: e.target.value })
              }
              placeholder="Имя ученика"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.phone}
              onChange={(e) =>
                setCreateModal({ ...createModal, phone: e.target.value })
              }
              placeholder="Номер телефона"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.days}
              onChange={(e) =>
                setCreateModal({ ...createModal, days: e.target.value })
              }
              placeholder="Дни уроков (например: Каждый день)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.dob}
              onChange={(e) =>
                setCreateModal({ ...createModal, dob: e.target.value })
              }
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.time}
              onChange={(e) =>
                setCreateModal({ ...createModal, time: e.target.value })
              }
              placeholder="Время (ЧЧ:ММ - ЧЧ:ММ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={createModal.note}
              onChange={(e) =>
                setCreateModal({ ...createModal, note: e.target.value })
              }
              placeholder="Примечание"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <label
              className="modal-label"
              style={{
                fontSize: "12px",
                color: "#6b7280",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Статус (Цвет строки)
            </label>
            <select
              className="modal-input modal-select"
              value={createModal.status}
              onChange={(e) =>
                setCreateModal({ ...createModal, status: e.target.value })
              }
              style={{ marginBottom: "20px", width: "100%" }}
            >
              <option value="row-normal">Обычный (Белый)</option>
              <option value="row-success">Успешный (Зеленый)</option>
              <option value="row-warn">Внимание (Желтый)</option>
              <option value="row-danger">Отказ / Должник (Красный)</option>
            </select>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeCreateModal}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={confirmCreate}>
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Редактирование ученика</h3>
            <input
              type="text"
              className="modal-input"
              value={editModal.subject}
              onChange={(e) =>
                setEditModal({ ...editModal, subject: e.target.value })
              }
              placeholder="Предмет"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.name}
              onChange={(e) =>
                setEditModal({ ...editModal, name: e.target.value })
              }
              placeholder="Имя ученика"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.phone}
              onChange={(e) =>
                setEditModal({ ...editModal, phone: e.target.value })
              }
              placeholder="Номер"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.days}
              onChange={(e) =>
                setEditModal({ ...editModal, days: e.target.value })
              }
              placeholder="Дни уроков"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.dob}
              onChange={(e) =>
                setEditModal({ ...editModal, dob: e.target.value })
              }
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.time}
              onChange={(e) =>
                setEditModal({ ...editModal, time: e.target.value })
              }
              placeholder="Время (ЧЧ:ММ - ЧЧ:ММ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <input
              type="text"
              className="modal-input"
              value={editModal.note}
              onChange={(e) =>
                setEditModal({ ...editModal, note: e.target.value })
              }
              placeholder="Примечание"
              style={{ marginBottom: "10px", width: "100%" }}
            />
            <label
              className="modal-label"
              style={{
                fontSize: "12px",
                color: "#6b7280",
                display: "block",
                marginBottom: "4px",
              }}
            >
              Статус (Цвет строки)
            </label>
            <select
              className="modal-input modal-select"
              value={editModal.status}
              onChange={(e) =>
                setEditModal({ ...editModal, status: e.target.value })
              }
              style={{ marginBottom: "20px", width: "100%" }}
            >
              <option value="row-normal">Обычный (Белый)</option>
              <option value="row-success">Успешный (Зеленый)</option>
              <option value="row-warn">Внимание (Желтый)</option>
              <option value="row-danger">Отказ / Должник (Красный)</option>
            </select>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeEditModal}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={confirmEdit}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
