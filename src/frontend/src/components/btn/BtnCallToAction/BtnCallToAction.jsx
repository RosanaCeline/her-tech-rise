import React from "react";
import style from "./BtnCallToAction.module.css";

export default function BtnCallToAction({ children, variant = "purple", onClick, type = "button" }) {

  const btnClass = `${style.btnCallToAction} ${
    variant === "white" ? style.white :
    variant === "border" ? style.border :
    style.purple
  }`;

  return (
    <button className={btnClass} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
