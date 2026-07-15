import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { initialStudents } from "../data";
import "../styles/Students.css";

const fieldsConfig = [
  { key: "name", placeholder: "Имя" },
  { key: "lastName", placeholder: "Фамилия" },
  { key: "dob", placeholder: "Год рождения (ДД.ММ.ГГГГ)" },
  { key: "phone", placeholder: "Тел Номер Родителей" },
  { key: "group", placeholder: "Название Группы" },
];

function Students() {
  const [studentsList, setStudentsList] = useState(() => {
    return Array.isArray(initialStudents) ? initialStudents : [];
  });

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

  const handleSave = () => {
    if (!form.name.trim() || !form.lastName.trim()) {
      alert("Имя и Фамилия обязательны!");
      return;
    }

    if (modal.type === "create") {
      const newId =
        studentsList.length > 0
          ? Math.max(...studentsList.map((s) => s?.id || 0)) + 1
          : 1;
      setStudentsList([...studentsList, { ...form, id: newId }]);
    } else if (modal.type === "edit") {
      setStudentsList(
        studentsList.map((s) =>
          s.id === modal.data.id ? { ...s, ...form } : s,
        ),
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    setStudentsList(studentsList.filter((s) => s.id !== modal.data.id));
    closeModal();
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

    const statusStr = s.status ? String(s.status) : "";
    const isActive = statusStr === "Активный" || statusStr === "Активная";

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
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => {
                const isActive =
                  student.status === "Активный" ||
                  student.status === "Активная";
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
                        className={`status-badge ${isActive ? "badge-active" : "badge-inactive"}`}
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
