import React, { useState, useEffect } from "react";
import { FiEdit2, FiSearch } from "react-icons/fi";
import "../styles/Students.css";

const API_URL = "http://localhost:5000/subjects";

function Subjects() {
  const [subjectsList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    activeOnly: false,
  });

  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({
    name: "",
    status: "Активный",
  });

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serverdan javob olishda xatolik!");
      const data = await response.json();
      setSubjectsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (type, subject = null) => {
    setModal({ type, data: subject });
    if (type === "edit" && subject) {
      setForm({
        name: subject.name || "",
        status: subject.status || "Активный",
      });
    }
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    if (!form.name.trim()) {
      alert("Название предмета обязательно!");
      return;
    }

    try {
      if (modal.type === "edit") {
        const response = await fetch(`${API_URL}/${modal.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Tahrirlashda xatolik yuz berdi");
        const updatedSubject = await response.json();
        setSubjectsList((prev) =>
          prev.map((s) => (s.id === modal.data.id ? updatedSubject : s)),
        );
      }
      closeModal();
    } catch (error) {
      console.error("Saqlashda xatolik:", error);
      alert("Amalni bajarishda xatolik yuz berdi!");
    }
  };

  const filteredSubjects = subjectsList.filter((s) => {
    if (!s) return false;

    const matchesName = (s.name || "")
      .toLowerCase()
      .includes(filters.name.toLowerCase());

    const statusStr = s.status ? String(s.status).toLowerCase() : "";
    const isActive =
      statusStr === "активный" ||
      statusStr === "активная" ||
      statusStr === "active";

    return matchesName && (!filters.activeOnly || isActive);
  });

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <h2 className="table-title">Предметы</h2>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Названия предмета</th>
              <th style={{ width: "200px" }}>Статус</th>
              <th style={{ textAlign: "center", width: "100px" }}>Действия</th>
            </tr>

            <tr className="filter-row">
              <td></td>
              <td>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Поиск по названию..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                />
              </td>
              <td>
                <div className="filter-toggle">
                  <span className="text-muted">Активный</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={filters.activeOnly}
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
                  colSpan="4"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Загрузка данных...
                </td>
              </tr>
            ) : filteredSubjects.length > 0 ? (
              filteredSubjects.map((subject, index) => {
                const statusStr = subject.status
                  ? String(subject.status).toLowerCase()
                  : "";
                const isActive =
                  statusStr === "активный" ||
                  statusStr === "активная" ||
                  statusStr === "active";
                return (
                  <tr key={subject.id} className="row-normal">
                    <td>{index + 1}</td>
                    <td className="fw-600">{subject.name}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          isActive ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {subject.status}
                      </span>
                    </td>
                    <td>
                      <div
                        className="table-actions"
                        style={{ justifyContent: "center" }}
                      >
                        <button
                          className="btn-act clr-blue"
                          onClick={() => openModal("edit", subject)}
                        >
                          <FiEdit2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#6b7280",
                  }}
                >
                  Нет подходящих предметов
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.type === "edit" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Редактирование предмета</h3>

            <div style={{ marginBottom: "14px" }}>
              <label className="modal-label">Название предмета</label>
              <input
                type="text"
                className="modal-input-field"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Например: GENERAL ENGLISH"
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label className="modal-label">Статус</label>
              <select
                className="modal-input-field modal-select"
                value={form.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <option value="Активный">Активный</option>
                <option value="Не активный">Не активный</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-confirm" onClick={handleSave}>
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subjects;
