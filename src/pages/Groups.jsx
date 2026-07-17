import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "../styles/Groups.css";

const API_URL = "http://localhost:5000/groups";

const fieldsConfig = [
  { key: "name", placeholder: "Названия группы" },
  { key: "teacher", placeholder: "Учитель" },
  { key: "time", placeholder: "Время уроков" },
  { key: "days", placeholder: "Дни уроков" },
];

function Groups() {
  const [groupsList, setGroupsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    name: "",
    teacher: "",
    time: "",
    days: "",
    activeOnly: false,
  });

  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({
    name: "",
    teacher: "",
    time: "",
    days: "",
    status: "Активный",
  });

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serverdan javob olishda xatolik!");
      const data = await response.json();
      setGroupsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (type, group = null) => {
    setModal({ type, data: group });
    if (type === "edit" && group) {
      setForm({
        name: group.name || "",
        teacher: group.teacher || "",
        time: group.time || "",
        days: group.days || "",
        status: group.status || "Активный",
      });
    } else {
      setForm({
        name: "",
        teacher: "",
        time: "",
        days: "",
        status: "Активный",
      });
    }
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    if (!form.name.trim() || !form.teacher.trim()) {
      alert("Название группы и Учитель обязательны!");
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
        const newGroup = await response.json();
        setGroupsList((prev) => [...prev, newGroup]);
      } else if (modal.type === "edit") {
        const response = await fetch(`${API_URL}/${modal.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Tahrirlashda xatolik yuz berdi");
        const updatedGroup = await response.json();
        setGroupsList((prev) =>
          prev.map((g) => (g.id === modal.data.id ? updatedGroup : g)),
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
        setGroupsList((prev) => prev.filter((g) => g.id !== modal.data.id));
        closeModal();
      } else {
        alert("O'chirishda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
    }
  };

  const filteredGroups = groupsList.filter((g) => {
    if (!g) return false;

    const isMatched = (field) => {
      const groupValue = g[field] ? String(g[field]).toLowerCase() : "";
      const filterValue = filters[field]
        ? String(filters[field]).toLowerCase()
        : "";
      return groupValue.includes(filterValue);
    };

    const statusStr = g.status ? String(g.status).toLowerCase() : "";
    const isActive =
      statusStr === "активный" ||
      statusStr === "активная" ||
      statusStr === "active";

    return (
      isMatched("name") &&
      isMatched("teacher") &&
      isMatched("time") &&
      isMatched("days") &&
      (!filters.activeOnly || isActive)
    );
  });

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <h2 className="table-title">Группы</h2>
        <button
          className="btn-confirm btn-add"
          onClick={() => openModal("create")}
        >
          <FiPlus style={{ marginRight: "6px", fontSize: "16px" }} /> Добавить
          группу
        </button>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Названия группы</th>
              <th>Учитель</th>
              <th>Время уроков</th>
              <th>Дни уроков</th>
              <th style={{ width: "150px" }}>Статус</th>
              <th style={{ width: "100px", textAlign: "center" }}>Действие</th>
            </tr>
            <tr className="filter-row">
              <td></td>
              {fieldsConfig.map((field) => (
                <td key={field.key}>
                  <input
                    type="text"
                    className="filter-input"
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                  />
                </td>
              ))}
              <td>
                <div className="filter-toggle">
                  <span className="text-muted" style={{ fontWeight: "600" }}>
                    Активный
                  </span>
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
                  colSpan="7"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Загрузка данных...
                </td>
              </tr>
            ) : filteredGroups.length > 0 ? (
              filteredGroups.map((group, index) => {
                const statusStr = group.status
                  ? String(group.status).toLowerCase()
                  : "";
                const isActive =
                  statusStr === "активный" ||
                  statusStr === "активная" ||
                  statusStr === "active";
                return (
                  <tr key={group.id} className="row-normal">
                    <td className="fw-600">{index + 1}</td>
                    <td className="fw-600">{group.name}</td>
                    <td>{group.teacher}</td>
                    <td>{group.time}</td>
                    <td className="text-muted">{group.days}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          isActive ? "badge-active" : "badge-inactive"
                        }`}
                      >
                        {group.status}
                      </span>
                    </td>
                    <td>
                      <div
                        className="table-actions"
                        style={{ justifyContent: "center" }}
                      >
                        <button
                          className="btn-act clr-blue"
                          onClick={() => openModal("edit", group)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn-act clr-red"
                          onClick={() => openModal("delete", group)}
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
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#6b7280",
                  }}
                >
                  Нет подходящих групп
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
                ? "Добавить группу"
                : "Редактирование группы"}
            </h3>

            {fieldsConfig.map((field) => (
              <div key={field.key} style={{ marginBottom: "16px" }}>
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
            <h3>Удаление группы</h3>
            <p>Вы уверены, что хотите удалить эту группу?</p>
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

export default Groups;
