import React, { useState } from "react";
import {
  FiCheckCircle,
  FiPhoneCall,
  FiUserX,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";

import { initialStudents } from "../data";
import "../styles/Home.css";

function Home() {
  const stats = [
    {
      id: 1,
      label: "Обработанно",
      value: "1",
      icon: <FiCheckCircle />,
      color: "st-blue",
    },
    {
      id: 2,
      label: "В обработке",
      value: "2",
      icon: <FiPhoneCall />,
      color: "st-purple",
    },
    {
      id: 3,
      label: "Отказы",
      value: "3",
      icon: <FiUserX />,
      color: "st-pink",
    },
    {
      id: 4,
      label: "Должники",
      value: "4",
      icon: <FiAlertTriangle />,
      color: "st-red",
    },
  ];

  const [studentsList, setStudentsList] = useState(initialStudents);
  const [activeTab, setActiveTab] = useState("Записи");

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: null,
    subject: "",
    name: "",
    phone: "",
    days: "",
    date1: "",
    date2: "",
    note: "",
    status: "row-normal",
  });

  const [createModal, setCreateModal] = useState({
    isOpen: false,
    subject: "",
    name: "",
    phone: "",
    days: "",
    date1: "",
    date2: "",
    note: "",
    status: "row-normal",
  });

  const tabs = ["Записи", "Пробный урок", "Новые группы"];

  const openCreateModal = () =>
    setCreateModal({
      isOpen: true,
      subject: "",
      name: "",
      phone: "",
      days: "",
      date1: "",
      date2: "",
      note: "",
      status: "row-normal",
    });

  const closeCreateModal = () =>
    setCreateModal({
      isOpen: false,
      subject: "",
      name: "",
      phone: "",
      days: "",
      date1: "",
      date2: "",
      note: "",
      status: "row-normal",
    });

  const confirmCreate = () => {
    if (createModal.name.trim() !== "" && createModal.phone.trim() !== "") {
      const newStudent = {
        id:
          studentsList.length > 0
            ? Math.max(...studentsList.map((s) => s.id)) + 1
            : 1,
        subject: createModal.subject,
        name: createModal.name,
        phone: createModal.phone,
        days: createModal.days,
        date1: createModal.date1,
        date2: createModal.date2,
        note: createModal.note,
        status: createModal.status,
      };

      setStudentsList([...studentsList, newStudent]);
      closeCreateModal();
    } else {
      alert("Имя ученика и Номер телефона обязательны для заполнения!");
    }
  };

  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, id });

  const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

  const confirmDelete = () => {
    setStudentsList(
      studentsList.filter((student) => student.id !== deleteModal.id),
    );
    closeDeleteModal();
  };

  const openEditModal = (student) =>
    setEditModal({
      isOpen: true,
      ...student,
    });

  const closeEditModal = () =>
    setEditModal({
      isOpen: false,
      id: null,
      subject: "",
      name: "",
      phone: "",
      days: "",
      date1: "",
      date2: "",
      note: "",
      status: "row-normal",
    });

  const confirmEdit = () => {
    if (editModal.name.trim() !== "" && editModal.phone.trim() !== "") {
      setStudentsList(
        studentsList.map((student) =>
          student.id === editModal.id ? { ...student, ...editModal } : student,
        ),
      );
    }
    closeEditModal();
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
            {studentsList.length > 0 ? (
              studentsList.map((student, index) => (
                <tr key={student.id} className={student.status}>
                  <td>{index + 1}</td>
                  <td className="fw-600">{student.subject}</td>
                  <td>{student.name}</td>
                  <td>{student.phone}</td>
                  <td>{student.days}</td>
                  <td className="text-muted">{student.date1}</td>
                  <td className="text-muted">{student.date2}</td>
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
              value={createModal.date1}
              onChange={(e) =>
                setCreateModal({ ...createModal, date1: e.target.value })
              }
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.date2}
              onChange={(e) =>
                setCreateModal({ ...createModal, date2: e.target.value })
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
              value={editModal.date1}
              onChange={(e) =>
                setEditModal({ ...editModal, date1: e.target.value })
              }
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.date2}
              onChange={(e) =>
                setEditModal({ ...editModal, date2: e.target.value })
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
