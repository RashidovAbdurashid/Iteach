import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "../styles/Students.css";

const API_URL = "http://localhost:5000/students";

const fieldsConfig = [
  { key: "name", placeholder: "Имя" },
  { key: "lastName", placeholder: "Фамилия" },
  { key: "dob", placeholder: "Год рождения (ДД.ММ.ГГГГ)" },
  { key: "phone", placeholder: "Тел Номер Родителей" },
  { key: "group", placeholder: "Название Группы" },
];

function Students() {
  const [studentsList, setStudentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    lastName: "",
    dob: "",
    phone: "",
    group: "",
    activeOnly: false,
  });

  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    dob: "",
    phone: "",
    group: "",
    status: "Активный",
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serverdan javob olishda xatolik!");
      const data = await response.json();
      setStudentsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (type, student = null) => {
    setModal({ type, data: student });
    if (type === "edit" && student) {
      setForm({
        name: student.name || "",
        lastName: student.lastName || "",
        dob: student.dob || "",
        phone: student.phone || "",
        group: student.group || "",
        status: student.status || "Активный",
      });
    } else {
      setForm({
        name: "",
        lastName: "",
        dob: "",
        phone: "",
        group: "",
        status: "Активный",
      });
    }
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    if (!form.name.trim() || !form.lastName.trim()) {
      alert("Имя и Фамилия обязательны!");
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
        const newStudent = await response.json();
        setStudentsList((prev) => [...prev, newStudent]);
      } else if (modal.type === "edit") {
        const response = await fetch(`${API_URL}/${modal.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Tahrirlashda xatolik yuz berdi");
        const updatedStudent = await response.json();
        setStudentsList((prev) =>
          prev.map((s) => (s.id === modal.data.id ? updatedStudent : s)),
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
        setStudentsList((prev) => prev.filter((s) => s.id !== modal.data.id));
        closeModal();
      } else {
        alert("O'chirishda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
    }
  };

  const filteredStudents = studentsList.filter((s) => {
    if (!s) return false;

    const isMatched = (field) => {
      const studentValue = s[field] ? String(s[field]).toLowerCase() : "";
      const filterValue = filters[field]
        ? String(filters[field]).toLowerCase()
        : "";
      return studentValue.includes(filterValue);
    };

    const statusStr = s.status ? String(s.status).toLowerCase() : "";
    const isActive =
      statusStr === "активный" ||
      statusStr === "активная" ||
      statusStr === "active";

    return (
      isMatched("name") &&
      isMatched("lastName") &&
      isMatched("dob") &&
      isMatched("phone") &&
      isMatched("group") &&
      (!filters.activeOnly || isActive)
    );
  });

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <h2 className="table-title">Ученики</h2>
        <button
          className="btn-confirm btn-add"
          onClick={() => openModal("create")}
        >
          <FiPlus style={{ marginRight: "6px", fontSize: "16px" }} /> Добавить
          ученика
        </button>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Год рождения</th>
              <th>Тел Номер Родителей</th>
              <th>Название Группы</th>
              <th>Статус</th>
              <th style={{ textAlign: "center" }}>Действие</th>
            </tr>

            <tr className="filter-row">
              <td></td>
              {fieldsConfig.map((field) => (
                <td key={field.key}>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Поиск..."
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                  />
                </td>
              ))}
              <td>
                <div className="filter-toggle">
                  <span className="text-muted">Активный</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={filters.activeOnly || false}
                      onChange={(e) =>
                        handleFilterChange("activeOnly", e.target.checked)
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </td>
              <td style={{ textAlign: "center" }}>
                <FiSearch className="search-icon" />
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Загрузка данных...
                </td>
              </tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const statusStr = student.status
                  ? String(student.status).toLowerCase()
                  : "";
                const isActive =
                  statusStr === "активный" ||
                  statusStr === "активная" ||
                  statusStr === "active";
                return (
                  <tr key={student.id} className="row-normal">
                    <td>{index + 1}</td>
                    <td className="fw-600">{student.name}</td>
                    <td>{student.lastName}</td>
                    <td>{student.dob}</td>
                    <td className="text-muted">{student.phone}</td>
                    <td>{student.group}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          isActive ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <div
                        className="table-actions"
                        style={{ justifyContent: "center" }}
                      >
                        <button
                          className="btn-act clr-blue"
                          onClick={() => openModal("edit", student)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-act clr-red"
                          onClick={() => openModal("delete", student)}
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
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#6b7280",
                  }}
                >
                  Нет подходящих учеников
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
                ? "Добавить ученика"
                : "Редактирование ученика"}
            </h3>

            {fieldsConfig.map((field) => (
              <div key={field.key} style={{ marginBottom: "14px" }}>
                <label className="modal-label">{field.placeholder}</label>
                <input
                  type="text"
                  className="modal-input-field"
                  value={form[field.key] || ""}
                  onChange={(e) => handleFormChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div style={{ marginBottom: "24px" }}>
              <label className="modal-label">Статус</label>
              <select
                className="modal-input-field modal-select"
                value={form.status || "Активный"}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <option value="Активный">Активный</option>
                <option value="Активная">Активная</option>
                <option value="Не активный">Не активный</option>
              </select>
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
            <h3>Удаление ученика</h3>
            <p>Вы уверены, что хотите удалить этого ученика?</p>
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

export default Students;
