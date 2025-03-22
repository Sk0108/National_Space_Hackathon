// src/components/CargoFormModal.jsx
import React from 'react';
import './CargoFormModal.css'; // custom styles

function CargoFormModal({ isOpen, onClose, onSave, cargoData, setCargoData }) {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCargoData({ ...cargoData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(cargoData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={cargoData.name}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={cargoData.weight}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="type"
            placeholder="Type"
            value={cargoData.type}
            onChange={handleChange}
            className="input-field"
          />
          <input
            type="text"
            name="status"
            placeholder="Status"
            value={cargoData.status}
            onChange={handleChange}
            className="input-field"
          />
          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CargoFormModal;
