// src/components/Dashboard.jsx
import React, { useState } from 'react';
import CargoTable from './CargoTable';
import CargoFormModal from './CargoFormModal';
import mockCargos from '../data/mockCargos';

function Dashboard() {
  const [cargos, setCargos] = useState(mockCargos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCargo, setNewCargo] = useState({
    name: '',
    weight: '',
    type: '',
    status: '',
  });

  const handleOpenModal = () => {
    setNewCargo({ name: '', weight: '', type: '', status: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveCargo = (cargo) => {
    setCargos([...cargos, { ...cargo, id: cargos.length + 1 }]);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Space animation background */}
      <div className="starry-bg"></div>

      {/* Dashboard Container */}
      <div className="dashboard-container">
        <div className="dashboard-header">Cargo Management Dashboard 🚀</div>

        <div className="dashboard-card">
          <div className="dashboard-actions">
            <button className="add-btn" onClick={handleOpenModal}>+ Add Cargo</button>
          </div>

          <div className="dashboard-table-wrapper">
            <CargoTable cargos={cargos} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <CargoFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCargo}
        cargoData={newCargo}
        setCargoData={setNewCargo}
      />
    </>
  );
}

export default Dashboard;

