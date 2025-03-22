import React from "react";

const CargoFilters = ({ search, setSearch, filterStatus, setFilterStatus }) => {
    return (
        <div className="flex space-x-4 mb-4">
            <input
                type="text"
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border p-2"
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2">
                <option value="">All Statuses</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Pending">Pending</option>
            </select>
        </div>
    );
};

export default CargoFilters;
