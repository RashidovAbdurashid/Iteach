import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import { initialGroups } from "../data";
import "../styles/Groups.css";

const fieldsConfig = [
  { key: "name", placeholder: "Название группы" },
  { key: "teacher", placeholder: "Учитель" },
  { key: "time", placeholder: "Время уроков" },
  { key: "days", placeholder: "Дни уроков" },
];

const checkIsActive = (status) => {
  const statusStr = String(status || "")
    .toLowerCase()
    .trim();
  return (
    statusStr === "активный" ||
    statusStr === "активная" ||
    statusStr === "active"
  );
};

function Groups() {
  const [groupsList, setGroupsList] = useState(initialGroups || []);

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

  const [validationError, setValidationError] = useState("");

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormChange = (key, value) => {
    setValidationError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (type, group = null) => {
    setValidationError("");
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

  const closeModal = () => {
    setModal({ type: null, data: null });
    setValidationError("");
  };

  const handleSave = () => {
    const trimmedName = form.name.trim();
    const trimmedTeacher = form.teacher.trim();

    if (!trimmedName || !trimmedTeacher) {
      setValidationError(
        "Название группы и Учитель обязательны для заполнения!",
      );
      return;
    }

    const updatedFormData = {
      ...form,
      name: trimmedName,
      teacher: trimmedTeacher,
      time: form.time.trim(),
      days: form.days.trim(),
    };

    if (modal.type === "create") {
      const newId =
        groupsList.length > 0
          ? Math.max(...groupsList.map((g) => Number(g?.id) || 0)) + 1
          : 1;
      setGroupsList((prev) => [...prev, { ...updatedFormData, id: newId }]);
    } else if (modal.type === "edit") {
      setGroupsList((prev) =>
        prev.map((g) =>
          g.id === modal.data.id ? { ...g, ...updatedFormData } : g,
        ),
      );
    }
    closeModal();
  };

  const handleDelete = () => {
    if (modal.data?.id) {
      setGroupsList((prev) => prev.filter((g) => g.id !== modal.data.id));
    }
    closeModal();
  };

  const filteredGroups = groupsList.filter((g) => {
    if (!g) return false;

    const matchesFields = fieldsConfig.every((field) => {
      const groupValue = String(g[field.key] || "").toLowerCase();
      const filterValue = String(filters[field.key] || "").toLowerCase();
      return groupValue.includes(filterValue);
    });

    const isActive = checkIsActive(g.status);

    return matchesFields && (!filters.activeOnly || isActive);
  });

  return (
    <div className="groups-page-container">
      <div className="groups-top-bar">
        <button className="btn-crimson-add" onClick={() => openModal("create")}>
          Добавить группу
        </button>
      </div>

      <div className="groups-card-table-container">
        <table className="groups-custom-table">
          <thead>
            <tr className="table-header-row">
              <th style={{ width: "50px" }}>#</th>
              <th>Название группы</th>
              <th>Учитель</th>
              <th>Время уроков</th>
              <th>Дни уроков</th>
              <th>Статус</th>
              <th style={{ textAlign: "center" }}>Действие</th>
            </tr>
            <tr className="table-filter-row">
              <td></td>
              {fieldsConfig.map((field) => (
                <td key={field.key}>
                  <input
                    type="text"
                    className="table-filter-input"
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(field.key, e.target.value)
                    }
                    placeholder="Поиск..."
                  />
                </td>
              ))}
              <td>
                <div className="table-filter-toggle">
                  <span>Активный</span>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      checked={filters.activeOnly || false}
                      onChange={(e) =>
                        handleFilterChange("activeOnly", e.target.checked)
                      }
                    />
                    <span className="custom-slider"></span>
                  </label>
                </div>
              </td>
              <td style={{ textAlign: "center" }}>
                <FiSearch className="table-search-icon" />
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, index) => {
                const isActive = checkIsActive(group.status);
                return (
                  <tr key={group.id} className="table-data-row">
                    <td className="row-index">{index + 1}</td>
                    <td className="row-bold">{group.name}</td>
                    <td>{group.teacher}</td>
                    <td>{group.time}</td>
                    <td>{group.days}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          isActive ? "pill-active" : "pill-inactive"
                        }`}
                      >
                        {group.status}
                      </span>
                    </td>
                    <td>
                      <div className="row-actions-cell">
                        <button
                          className="action-btn-edit"
                          onClick={() => openModal("edit", group)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="action-btn-delete"
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
                    padding: "30px",
                    color: "#9ca3af",
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
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div
            className="custom-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {modal.type === "create"
                ? "Добавить группу"
                : "Редактирование группы"}
            </h3>

            {validationError && (
              <div
                style={{
                  color: "#ef4444",
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                {validationError}
              </div>
            )}

            {fieldsConfig.map((field) => (
              <div key={field.key} className="modal-input-group">
                <label className="modal-field-label">{field.placeholder}</label>
                <input
                  type="text"
                  className="modal-field-input"
                  value={form[field.key] || ""}
                  onChange={(e) => handleFormChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            <div className="modal-input-group">
              <label className="modal-field-label">Статус</label>
              <select
                className="modal-field-input modal-select"
                value={form.status || "Активный"}
                onChange={(e) => handleFormChange("status", e.target.value)}
              >
                <option value="Активный">Активный</option>
                <option value="Неактивный">Неактивный</option>
              </select>
            </div>

            <div className="modal-footer-btns">
              <button className="btn-modal-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="btn-modal-submit" onClick={handleSave}>
                {modal.type === "create" ? "Добавить" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.type === "delete" && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div
            className="custom-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Удаление группы</h3>
            <p>Вы уверены, что хотите удалить эту группу?</p>
            <div className="modal-footer-btns">
              <button className="btn-modal-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button
                className="btn-modal-submit danger"
                onClick={handleDelete}
              >
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
