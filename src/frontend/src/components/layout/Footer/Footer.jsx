import React, { useState } from 'react';

import "../../../index.css";
import style from "./Footer.module.css";
import logo from "../../../assets/logo/LogoName.png";

export default function Footer () {
    return (
        <footer className={style.footerHtr}>
            <img src={logo} alt="Logo Her Tech Rise" />
            <span>© Copyright Her Tech Rise 2025. Todos os direitos reservados.</span>
        </footer>
        
    )
}