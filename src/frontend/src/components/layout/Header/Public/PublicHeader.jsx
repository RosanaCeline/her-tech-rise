import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from "./PublicHeader.module.css"
import logo from "../../../../assets/logo/LogoSimbol.png"

export default function PublicHeader () {
    const [menuVisible, setMenuVisible] = useState(false);
    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoHtr}>
                <img src={logo} alt="Logo Her Tech Rise" />
                <span>Her Tech Rise</span>
            </div>
            <svg className={styles.buttonNav} viewBox="0 0 60 40" onClick={toggleMenu}>
                <g stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <path className={`${styles.line} ${menuVisible ? styles.topActive : ''}`} d="M10,10 L50,10 Z" />
                    <path className={`${styles.line} ${menuVisible ? styles.middleActive : ''}`} d="M10,20 L50,20 Z" />
                    <path className={`${styles.line} ${menuVisible ? styles.bottomActive : ''}`} d="M10,30 L50,30 Z" />
                </g>
            </svg>
            <nav className={`${styles.navegation} ${menuVisible ? styles.active : ''}`}>
                <button className={styles.btnLogin} onClick={() => window.location.href = '/login'}>Entrar</button>
                <button className={styles.btnCadastro} onClick={() => window.location.href = '/cadastro'}>Cadastre-se</button>
            </nav>
        </header>
    );
}
