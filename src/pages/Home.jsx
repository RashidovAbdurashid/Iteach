import React, { useState } from "react";
import {
  FiCheckCircle,
  FiPhoneCall,
  FiUserX,
  FiAlertTriangle,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
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
    { id: 3, label: "Отказы", value: "3", icon: <FiUserX />, color: "st-pink" },
    {
      id: 4,
      label: "Должники",
      value: "4",
      icon: <FiAlertTriangle />,
      color: "st-red",
    },
  ];

  const initialStudents = [
    {
      id: 1,
      subject: "IELTS",
      name: "Абдуллах",
      phone: "+998 99 310 22 10",
      days: "Каждый день",
      date1: "06/12/2024",
      date2: "09:00 - 10:20",
      note: "06.12 придет на консультаци",
      status: "row-warn",
    },
    {
      id: 2,
      subject: "GENERAL ENGLISH",
      name: "Абубакр",
      phone: "+998 95 217 11 17",
      days: "Вторник, Четверг, Суббота",
      date1: "05/12/2024",
      date2: "10:30 - 11:50",
      note: "07.12 N-199",
      status: "row-success",
    },
    {
      id: 3,
      subject: "IELTS",
      name: "Саида",
      phone: "+998 33 747 36 37",
      days: "Понедельник, Среда, Пятница",
      date1: "04/12/2024",
      date2: "12:00 - 13:20",
      note: "05.12 нету времени",
      status: "row-normal",
    },
    {
      id: 4,
      subject: "GENERAL ENGLISH",
      name: "Муниса",
      phone: "+998 94 681 18 81",
      days: "Каждый день",
      date1: "04/12/2024",
      date2: "14:00 - 15:20",
      note: "Ждет группу",
      status: "row-normal",
    },
    {
      id: 5,
      subject: "GENERAL ENGLISH",
      name: "Хадича",
      phone: "+998 90 908 14 26",
      days: "Каждый день",
      date1: "03/12/2024",
      date2: "15:30 - 16:50",
      note: "Хочет прийти на speaking",
      status: "row-normal",
    },
    {
      id: 6,
      subject: "GENERAL ENGLISH",
      name: "Моминбек",
      phone: "+998 93 514 17 18",
      days: "Каждый день",
      date1: "03/12/2024",
      date2: "17:00 - 18:20",
      note: "Ушел",
      status: "row-danger",
    },
  ];

  const [studentsList, setStudentsList] = useState(initialStudents);
  const [activeTab, setActiveTab] = useState("Записи");

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const tabs = ["Записи", "Пробный урок", "Новые группы"];

  const openDeleteModal = (id) => setDeleteModal({ isOpen: true, id });

  const closeDeleteModal = () => setDeleteModal({ isOpen: false, id: null });

  const confirmDelete = () => {
    setStudentsList(
      studentsList.filter((student) => student.id !== deleteModal.id),
    );
    closeDeleteModal();
  };

  const openEditModal = (student) =>
    setEditModal({ isOpen: true, id: student.id, name: student.name });

  const closeEditModal = () =>
    setEditModal({ isOpen: false, id: null, name: "" });

  const confirmEdit = () => {
    if (editModal.name.trim() !== "") {
      setStudentsList(
        studentsList.map((student) =>
          student.id === editModal.id
            ? { ...student, name: editModal.name }
            : student,
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

      {editModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Редактирование ученика</h3>
            <input
              type="text"
              className="modal-input"
              value={editModal.name}
              onChange={(e) =>
                setEditModal({ ...editModal, name: e.target.value })
              }
              placeholder="Имя ученика"
            />
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
