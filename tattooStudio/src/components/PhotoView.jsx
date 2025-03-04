import React from "react";

export function PhotoView({ src, alt, closeModal }) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={closeModal}>
          &times;
        </span>
        <img src={src} alt={alt} className="modal-image" />
      </div>
    </div>
  );
}
