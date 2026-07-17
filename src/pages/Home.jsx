import React, { useEffect, useState } from "react";
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

  function fetchStudents() {
    setLoading(true);
    fetch(API_URL)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("Ошибка сервера");
        }
        return res.json();
      })
      .then(function (data) {
        setStudentsList(data);
        setLoading(false);
      })
      .catch(function (err) {
        console.error("Xatolik:", err);
        setLoading(false);
      });
  }

  useEffect(function () {
    fetchStudents();
  }, []);

  function openCreateModal() {
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
  }

  function closeCreateModal() {
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
  }

  function confirmCreate() {
    if (createModal.name.trim() !== "" && createModal.phone.trim() !== "") {
      const newStudent = {
        subject: createModal.subject,
        name: createModal.name,
        phone: createModal.phone,
        days: createModal.days,
        date1: createModal.date1,
        date2: createModal.date2,
        note: createModal.note,
        status: createModal.status,
      };

      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (createdData) {
          setStudentsList(function (prev) {
            return [...prev, createdData];
          });
          closeCreateModal();
        })
        .catch(function (err) {
          console.error("Xatolik:", err);
        });
    } else {
      alert("Имя ученика и Номер телефона обязательны для заполнения!");
    }
  }

  function openDeleteModal(id) {
    setDeleteModal({ isOpen: true, id: id });
  }

  function closeDeleteModal() {
    setDeleteModal({ isOpen: false, id: null });
  }

  function confirmDelete() {
    fetch(`${API_URL}/${deleteModal.id}`, {
      method: "DELETE",
    })
      .then(function () {
        setStudentsList(function (prev) {
          return prev.filter(function (student) {
            return student.id !== deleteModal.id;
          });
        });
        closeDeleteModal();
      })
      .catch(function (err) {
        console.error("Xatolik:", err);
      });
  }

  function openEditModal(student) {
    setEditModal({
      isOpen: true,
      ...student,
    });
  }

  function closeEditModal() {
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
  }

  function confirmEdit() {
    if (editModal.name.trim() !== "" && editModal.phone.trim() !== "") {
      const { isOpen, ...updatedStudent } = editModal;

      fetch(`${API_URL}/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (data) {
          setStudentsList(function (prev) {
            return prev.map(function (student) {
              return student.id === data.id ? data : student;
            });
          });
          closeEditModal();
        })
        .catch(function (err) {
          console.error("Xatolik:", err);
        });
    } else {
      alert("Имя ученика и Номер телефона обязательны!");
    }
  }

  return (
    <div className="home-container">
      <div className="home-stats">
        {stats.map(function (stat) {
          return (
            <div key={stat.id} className="stat-box">
              <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-title">{stat.label}</span>
                <span className="stat-number">{stat.value}</span>
              </div>
            </div>
          );
        })}
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
              studentsList.map(function (student, index) {
                return (
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
                          onClick={function () {
                            openEditModal(student);
                          }}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-act clr-red"
                          onClick={function () {
                            openDeleteModal(student.id);
                          }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
        {tabs.map(function (tab) {
          return (
            <button
              key={tab}
              className={`tb-btn ${activeTab === tab ? "active" : ""}`}
              onClick={function () {
                setActiveTab(tab);
              }}
            >
              {tab}
            </button>
          );
        })}
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
              onChange={function (e) {
                setCreateModal({ ...createModal, subject: e.target.value });
              }}
              placeholder="Предмет (например: IELTS)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.name}
              onChange={function (e) {
                setCreateModal({ ...createModal, name: e.target.value });
              }}
              placeholder="Имя ученика"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.phone}
              onChange={function (e) {
                setCreateModal({ ...createModal, phone: e.target.value });
              }}
              placeholder="Номер телефона"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.days}
              onChange={function (e) {
                setCreateModal({ ...createModal, days: e.target.value });
              }}
              placeholder="Дни уроков (например: Каждый день)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.date1}
              onChange={function (e) {
                setCreateModal({ ...createModal, date1: e.target.value });
              }}
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.date2}
              onChange={function (e) {
                setCreateModal({ ...createModal, date2: e.target.value });
              }}
              placeholder="Время (ЧЧ:ММ - ЧЧ:ММ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={createModal.note}
              onChange={function (e) {
                setCreateModal({ ...createModal, note: e.target.value });
              }}
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
              onChange={function (e) {
                setCreateModal({ ...createModal, status: e.target.value });
              }}
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
              onChange={function (e) {
                setEditModal({ ...editModal, subject: e.target.value });
              }}
              placeholder="Предмет"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.name}
              onChange={function (e) {
                setEditModal({ ...editModal, name: e.target.value });
              }}
              placeholder="Имя ученика"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.phone}
              onChange={function (e) {
                setEditModal({ ...editModal, phone: e.target.value });
              }}
              placeholder="Номер"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.days}
              onChange={function (e) {
                setEditModal({ ...editModal, days: e.target.value });
              }}
              placeholder="Дни уроков"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.date1}
              onChange={function (e) {
                setEditModal({ ...editModal, date1: e.target.value });
              }}
              placeholder="Дата (ДД/ММ/ГГГГ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.date2}
              onChange={function (e) {
                setEditModal({ ...editModal, date2: e.target.value });
              }}
              placeholder="Время (ЧЧ:ММ - ЧЧ:ММ)"
              style={{ marginBottom: "10px", width: "100%" }}
            />

            <input
              type="text"
              className="modal-input"
              value={editModal.note}
              onChange={function (e) {
                setEditModal({ ...editModal, note: e.target.value });
              }}
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
              onChange={function (e) {
                setEditModal({ ...editModal, status: e.target.value });
              }}
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
