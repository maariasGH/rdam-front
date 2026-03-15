import React, { useEffect, useState } from 'react';

const OperadorDashboard = ({ nombre }) => {
  const [tramites, setTramites] = useState([]);
  const [filtroCuil, setFiltroCuil] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
    const url = filtroCuil 
      ? `http://localhost:8000/api/tramites?cuil=${filtroCuil}` 
      : 'http://localhost:8000/api/tramites';
    
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setTramites(data);
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    await fetch(`http://localhost:8000/api/tramites/${id}?estado=${nuevoEstado}`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTramites(); // Recargar lista
  };

  const emitirCertificado = async (tramiteId) => {
    // Ejemplo simplificado de emisión
    await fetch(`http://localhost:8000/api/certificados/emitir?tramite_id=${tramiteId}&url_s3=http://bucket.s3/cert.pdf&operador_id=1`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    alert("Certificado Emitido");
    fetchTramites();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Panel de Operador</h1>
      <p>Bienvenido, {nombre}</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Buscar por CUIL" 
          onChange={(e) => setFiltroCuil(e.target.value)} 
        />
        <button onClick={fetchTramites}>Filtrar</button>
      </div>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>CUIL</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map(t => (
            <tr key={t.tramite_id}>
              <td>{t.tramite_id}</td>
              <td>{t.cuil}</td>
              <td><strong>{t.estado}</strong></td>
              <td>
                <button onClick={() => cambiarEstado(t.tramite_id, 'RECHAZADA')}>Rechazar</button>
                {t.estado === 'PAGADA' && (
                  <button onClick={() => emitirCertificado(t.tramite_id)} style={{backgroundColor: 'lightgreen'}}>
                    Emitir Certificado
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperadorDashboard;