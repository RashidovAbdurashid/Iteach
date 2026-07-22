import React, { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaUserGraduate,
  FaUsers,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaUserTie,
  FaDoorOpen,
  FaBook,
} from "react-icons/fa";
import { FiBell, FiSettings, FiGrid, FiLogOut, FiUser } from "react-icons/fi";
import "../styles/Layout.css";

function Layout() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  

  const [adminName, setAdminName] = useState("Администратор");
  const [siteName, setSiteName] = useState("Iteach");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  

  const settingsRef = useRef(null);
  const notificationsRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsSettingsOpen(false);
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="layout-wrapper">
      <aside className="layout-sidebar">
        <div className="sidebar-logo">
          <FiGrid className="logo-icon" />
          <span>{siteName}</span>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-links-scroll">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaUserEdit className="menu-icon" /> Регистрация
            </NavLink>
            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaUserGraduate className="menu-icon" /> Ученики
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaUsers className="menu-icon" /> Группы
            </NavLink>
            <NavLink
              to="/payment"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaMoneyCheckAlt className="menu-icon" /> Оплата
            </NavLink>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaUserTie className="menu-icon" /> Сотрудники
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaDoorOpen className="menu-icon" /> Комнаты
            </NavLink>
            <NavLink
              to="/subjects"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <FaBook className="menu-icon" /> Предметы
            </NavLink>
          </div>

          <div className="sidebar-footer">
            <hr className="sidebar-divider" />
            <button className="menu-link logout-btn" onClick={handleLogout}>
              <FiLogOut className="menu-icon" /> Выйти
            </button>
          </div>
        </nav>
      </aside>

      <main className="layout-main">
        <header className="layout-navbar">
          <div className="navbar-actions">
            <div className="navbar-icons">
              <div className="dropdown-container" ref={settingsRef}>
                <button
                  className={`icon-btn ${isSettingsOpen ? "active-btn" : ""}`}
                  onClick={() => {
                    setIsSettingsOpen(!isSettingsOpen);
                    setIsNotificationsOpen(false);
                  }}
                >
                  <FiSettings />
                </button>
                {isSettingsOpen && (
                  <div className="dropdown-menu align-right">
                    <div className="dropdown-header">Настройки</div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setIsSettingsOpen(false);
                        navigate("/profile");
                      }}
                    >
                      <FiUser className="item-icon" /> Профиль
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setActiveModal("site");
                        setIsSettingsOpen(false);
                      }}
                    >
                      <FiSettings className="item-icon" /> Настройки сайта
                    </button>
                    <hr className="dropdown-divider" />
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="item-icon" /> Выйти
                    </button>
                  </div>
                )}
              </div>

              <div className="dropdown-container" ref={notificationsRef}>
                <button
                  className={`icon-btn has-badge ${isNotificationsOpen ? "active-btn" : ""}`}
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsSettingsOpen(false);
                  }}
                >
                  <FiBell />
                </button>
                {isNotificationsOpen && (
                  <div className="dropdown-menu align-right wide-menu">
                    <div className="dropdown-header">Уведомления</div>
                    <div className="notification-item unread">
                      <p className="notification-text">
                        <strong>Новый ученик</strong> зарегистрировался на курс
                        English Advanced.
                      </p>
                      <span className="notification-time">5 минут назад</span>
                    </div>
                    <div className="notification-item">
                      <p className="notification-text">
                        Оплата от Ивана Иванова успешно подтверждена.
                      </p>
                      <span className="notification-time">1 час назад</span>
                    </div>
                    <div className="dropdown-footer">
                      <button className="view-all-btn">Показать все</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="navbar-profile"
              onClick={handleProfileClick}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`https://ui-avatars.com/api/?name=${adminName}&background=0284c7&color=fff`}
                alt="User"
              />
              <div className="profile-text">
                <span className="profile-name">{adminName}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="layout-content">
          <Outlet />
        </div>
      </main>

      {activeModal === "site" && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Настройки сайта</h3>
            <label className="modal-label">Название проекта</label>
            <input
              type="text"
              className="modal-input"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Название сайта"
            />
            <div className="theme-toggle-section">
              <span>Темная тема</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="modal-actions">
              <button
                className="btn-confirm"
                onClick={() => setActiveModal(null)}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
