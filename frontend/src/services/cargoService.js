import cargos from "../data/mockCargos";

export const getCargos = () => {
    return cargos;
};

export const addCargo = (cargo) => {
    cargos.push({ ...cargo, id: Date.now() });
};

export const updateCargo = (updatedCargo) => {
    const index = cargos.findIndex(c => c.id === updatedCargo.id);
    cargos[index] = updatedCargo;
};

export const deleteCargo = (id) => {
    const index = cargos.findIndex(c => c.id === id);
    cargos.splice(index, 1);
};
