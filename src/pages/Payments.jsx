import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from "react-icons/fi";
import "../styles/Payments.css"


const API_URL = "http://localhost:5000/payments";

const fieldsConfig = [
  { key: "checkNumber", placeholder: "Номер чека" },
  { key: "group", placeholder: "Названия группы" },
  { key: "student", placeholder: "Ученика" },
  { key: "teacher", placeholder: "Учителя" },
  { key: "paymentDate", placeholder: "Дата оплаты" },
  { key: "discount", placeholder: "Скидка" },
  { key: "amount", placeholder: "Суммы оплаты" },
  { key: "month", placeholder: "Месяц который оплатил" },
  { key: "paymentType", placeholder: "Тип оплаты" },
  { key: "comment", placeholder: "Комментарии" },
];

const initialPaymentsData = [
  {
    id: "1",
    checkNumber: "25501",
    group: "N-174 Elementary",
    student: "Шарипов Абдуллах",
    teacher: "Вохидова Мукаррам",
    paymentDate: "10.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Наличными",
    comment: "",
  },
  {
    id: "2",
    checkNumber: "25500",
    group: "N-194 Beginner",
    student: "Анваров Абубакр",
    teacher: "Мирзаева Гозал",
    paymentDate: "07.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Наличными",
    comment: "",
  },
  {
    id: "3",
    checkNumber: "25499",
    group: "N-188 Beginner",
    student: "Раджабова Саида",
    teacher: "Нуриллаев Савар",
    paymentDate: "05.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Переводом",
    comment: "",
  },
  {
    id: "4",
    checkNumber: "25498",
    group: "N-177 Pre-Inter",
    student: "Бориева Хадича",
    teacher: "Бориева Хадича",
    paymentDate: "03.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Наличными",
    comment: "",
  },
  {
    id: "5",
    checkNumber: "25497",
    group: "N-180 Inter",
    student: "Латипов Моминбек",
    teacher: "Латипов Жахонгтр",
    paymentDate: "03.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Переводом",
    comment: "",
  },
  {
    id: "6",
    checkNumber: "25496",
    group: "N-179 Elementary",
    student: "Очилов Одилжон",
    teacher: "Очилов Тохир",
    paymentDate: "01.10.2024",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Переводом",
    comment: "",
  },
];

function Payments() {
  const [paymentsList, setPaymentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    checkNumber: "",
    group: "",
    student: "",
    teacher: "",
    paymentDate: "",
    discount: "",
    amount: "",
    month: "",
    paymentType: "",
    comment: "",
  });

  const [modal, setModal] = useState({ type: null, data: null });
  const [form, setForm] = useState({
    checkNumber: "",
    group: "",
    student: "",
    teacher: "",
    paymentDate: "",
    discount: "0%",
    amount: "680.000 сум",
    month: "Ноябрь",
    paymentType: "Наличными",
    comment: "",
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Serverdan javob olishda xatolik!");
      const data = await response.json();
      setPaymentsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openModal = (type, payment = null) => {
    setModal({ type, data: payment });
    if (type === "edit" && payment) {
      setForm({
        checkNumber: payment.checkNumber || "",
        group: payment.group || "",
        student: payment.student || "",
        teacher: payment.teacher || "",
        paymentDate: payment.paymentDate || "",
        discount: payment.discount || "0%",
        amount: payment.amount || "",
        month: payment.month || "",
        paymentType: payment.paymentType || "Наличными",
        comment: payment.comment || "",
      });
    } else {
      setForm({
        checkNumber: "",
        group: "",
        student: "",
        teacher: "",
        paymentDate: "",
        discount: "0%",
        amount: "680.000 сум",
        month: "Ноябрь",
        paymentType: "Наличными",
        comment: "",
      });
    }
  };

  const closeModal = () => setModal({ type: null, data: null });

  const handleSave = async () => {
    if (!form.checkNumber.trim() || !form.student.trim()) {
      alert("Номер чека и Ученик обязательны!");
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
        const newPayment = await response.json();
        setPaymentsList((prev) => [...prev, newPayment]);
      } else if (modal.type === "edit") {
        const response = await fetch(`${API_URL}/${modal.data.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!response.ok) throw new Error("Tahrirlashda xatolik yuz berdi");
        const updatedPayment = await response.json();
        setPaymentsList((prev) =>
          prev.map((p) => (p.id === modal.data.id ? updatedPayment : p)),
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
        setPaymentsList((prev) => prev.filter((p) => p.id !== modal.data.id));
        closeModal();
      } else {
        alert("O'chirishda xatolik yuz berdi!");
      }
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
    }
  };

  const filteredPayments = paymentsList.filter((p) => {
    if (!p) return false;

    return fieldsConfig.every((field) => {
      const itemValue = p[field.key] ? String(p[field.key]).toLowerCase() : "";
      const filterValue = filters[field.key]
        ? String(filters[field.key]).toLowerCase()
        : "";
      return itemValue.includes(filterValue);
    });
  });

  return (
    <div className="home-container">
      <div className="table-header-bar">
        <button
          className="btn-confir"
          onClick={() => openModal("create")}
        >
          <FiPlus style={{ marginRight: "6px", fontSize: "16px" }} /> Добавить
          оплату
        </button>
      </div>

      <div className="home-table-container">
        <table className="home-table">
          <thead>
            <tr>
              <th style={{ width: "40px" }}>#</th>
              <th>Номер чека</th>
              <th>Названия группы</th>
              <th>Ученика</th>
              <th>Учителя</th>
              <th>Месяц который оплатил</th>
              <th>Скидка</th>
              <th>Суммы оплаты</th>
              <th>Дата оплаты</th>
              <th>Тип оплаты</th>
              <th>Комментарии</th>
              <th style={{ textAlign: "center" }}>Действия</th>
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
              <td style={{ textAlign: "center" }}>
                <FiSearch className="search-icon" />
              </td>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="12"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  Загрузка данных...
                </td>
              </tr>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((item, index) => (
                <tr key={item.id || index} className="row-normal">
                  <td>{index + 1}</td>
                  <td className="fw-600">{item.checkNumber}</td>
                  <td className="fw-600">{item.group}</td>
                  <td>{item.student}</td>
                  <td>{item.teacher}</td>
                  <td>{item.paymentDate}</td>
                  <td>{item.discount}</td>
                  <td className="fw-600">{item.amount}</td>
                  <td>{item.month}</td>
                  <td>{item.paymentType}</td>
                  <td className="text-muted">{item.comment || "—"}</td>
                  <td>
                    <div
                      className="table-actions"
                      style={{ justifyContent: "center" }}
                    >
                      <button
                        className="btn-act clr-blue"
                        onClick={() => openModal("edit", item)}
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        className="btn-act clr-red"
                        onClick={() => openModal("delete", item)}
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
                  colSpan="12"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#6b7280",
                  }}
                >
                  Нет данных об оплате
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
                ? "Добавить оплату"
                : "Редактирование оплаты"}
            </h3>

            {fieldsConfig.map((field) => (
              <div key={field.key} style={{ marginBottom: "12px" }}>
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
            <h3>Удаление оплаты</h3>
            <p>Вы уверены, что хотите удалить эту запись?</p>
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

export default Payments;
