import React from 'react';
import './CargoTable.css';

const CargoTable = () => {
  // dummy cargos for now
  const cargos = [
    { id: 1, name: 'Cargo A', destination: 'New York', weight: '500kg' },
    { id: 2, name: 'Cargo B', destination: 'London', weight: '1 ton' },
  ];

  return (
    <table className="cargo-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Destination</th>
          <th>Weight</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {cargos.map((cargo) => (
          <tr key={cargo.id}>
            <td>{cargo.name}</td>
            <td>{cargo.destination}</td>
            <td>{cargo.weight}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CargoTable;
