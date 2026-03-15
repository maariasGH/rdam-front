import React, { useState } from 'react';

const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user || { login: '', nombre_completo: '', rol: 'OPERADOR', password: '', registrador_id: 1 });

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h3>{user ? 'Editar Usuario' : 'Crear Usuario'}</h3>
        <input placeholder="Login" value={formData.login} onChange={(e) => setFormData({...formData, login: e.target.value})} disabled={!!user} />
        <input placeholder="Nombre Completo" value={formData.nombre_completo} onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} />
        <select value={formData.rol} onChange={(e) => setFormData({...formData, rol: e.target.value})}>
          <option value="OPERADOR">Operador</option>
          <option value="ADMINISTRADOR">Administrador</option>
        </select>
        <input type="password" placeholder="Password (dejar vacío si no cambia)" onChange={(e) => setFormData({...formData, password: e.target.value})} />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default UserForm;