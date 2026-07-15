import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  FaUserEdit,
  FaUserGraduate,
  FaUsers,
  FaMoneyCheckAlt,
  FaClipboardList,
  FaUserTie,
  FaDoorOpen,
  FaBook,
  FaSearch,
} from "react-icons/fa";
import { FiBell, FiSettings, FiGrid } from "react-icons/fi";
import "../styles/Layout.css";

function Layout() {
  return (
    <div className="layout-wrapper">
      <aside className="layout-sidebar">
        <div className="sidebar-logo">
          <FiGrid className="logo-icon" />
          <span>Iteach</span>
        </div>

        <nav className="sidebar-menu">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <FaUserEdit className="menu-icon" /> Регистрация
          </NavLink>
          <NavLink to="/students" className="menu-link">
            <FaUserGraduate className="menu-icon" /> Ученики
          </NavLink>
          <NavLink to="/groups" className="menu-link">
            <FaUsers className="menu-icon" /> Группы
          </NavLink>
          <NavLink to="/payment" className="menu-link">
            <FaMoneyCheckAlt className="menu-icon" /> Оплата
          </NavLink>
          <NavLink to="/attendance" className="menu-link">
            <FaClipboardList className="menu-icon" /> Посещаемость
          </NavLink>
          <NavLink to="/employees" className="menu-link">
            <FaUserTie className="menu-icon" /> Сотрудники
          </NavLink>
          <NavLink to="/rooms" className="menu-link">
            <FaDoorOpen className="menu-icon" /> Комнаты
          </NavLink>
          <NavLink to="/subjects" className="menu-link">
            <FaBook className="menu-icon" /> Предметы
          </NavLink>
        </nav>
      </aside>

      <main className="layout-main">
        <header className="layout-navbar">
          <div className="navbar-actions">
            <div className="navbar-icons">
              <button className="icon-btn">
                <FiSettings />
              </button>
              <button className="icon-btn has-badge">
                <FiBell />
              </button>
            </div>

            <div className="navbar-profile">
              <img
                src="https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff"
                alt="User"
              />
              <div className="profile-text">
                <span className="profile-name">Администратор</span>
              </div>
            </div>
          </div>
        </header>

        <div className="layout-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
