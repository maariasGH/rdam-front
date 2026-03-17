import React, { useEffect, useState } from 'react';

const OperadorDashboard = ({ nombre }) => {
  const [tramites, setTramites] = useState([]);
  const [filtroCuil, setFiltroCuil] = useState('');
  // --- NUEVOS ESTADOS PARA FILTROS ---
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTramites();
  }, []);

  const fetchTramites = async () => {
    // Construimos los Query Params dinámicamente
    const params = new URLSearchParams();
    if (filtroCuil) params.append('cuil', filtroCuil);
    if (filtroEstado) params.append('estado', filtroEstado);
    if (filtroFecha) params.append('fecha', filtroFecha);

    const url = `http://localhost:8000/api/tramites?${params.toString()}`;
    
    try {
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTramites(data);
    } catch (error) {
      console.error("Error al obtener trámites:", error);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setTramites(prev => prev.map(t => 
      t.tramite_id === id ? { ...t, estado: nuevoEstado } : t
    ));

    try {
      await fetch(`http://localhost:8000/api/tramites/${id}?estado=${nuevoEstado}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const emitirCertificado = async (tramiteId) => {
      await fetch(`http://localhost:8000/api/certificados/emitir?tramite_id=${tramiteId}&url_s3=http://bucket.s3/cert.pdf&operador_id=1`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Certificado Emitido con éxito");
      fetchTramites();
    };

    const limpiarFiltros = async () => {
    // Reseteamos los estados de los inputs
    setFiltroCuil('');
    setFiltroEstado('');
    setFiltroFecha('');

    // Llamamos a la API directamente con la URL limpia
    // No usamos fetchTramites() acá porque los estados de arriba 
    // tardan un milisegundo en actualizarse y fetchTramites podría leer los viejos.
    try {
      const res = await fetch('http://localhost:8000/api/tramites', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTramites(data);
    } catch (error) {
      console.error("Error al limpiar filtros:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h2 style={styles.title}>Panel de Operador</h2>
          <p style={styles.subtitle}>Gestionando solicitudes de ciudadanos</p>
        </div>
        
        {/* --- SECCIÓN DE FILTROS MEJORADA --- */}
        <div style={styles.filterBar}>
          <input 
            style={styles.inputSearch}
            placeholder="CUIL..." 
            value={filtroCuil}
            onChange={(e) => setFiltroCuil(e.target.value)} 
          />
          
          <select 
            style={styles.selectFilter}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="PAGADA">PAGADA</option>
            <option value="RECHAZADA">RECHAZADA</option>
            <option value="EMITIDA">EMITIDA</option>
          </select>

          <input 
            type="date"
            style={styles.inputSearch}
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />

          <button onClick={fetchTramites} style={styles.btnSearch}>Filtrar</button>
          <button onClick={limpiarFiltros} style={styles.btnLimpiar}>
            Limpiar
          </button>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID Trámite</th>
              <th style={styles.th}>CUIL Solicitante</th>
              <th style={styles.th}>Estado Actual</th>
              <th style={styles.th}>Fecha Solicitud</th>
              <th style={styles.thCentered}>Acciones de Gestión</th>
            </tr>
          </thead>
          <tbody>
            {tramites.map(t => (
              <tr key={t.tramite_id} style={styles.tr}>
                <td style={styles.td}><span style={styles.idBadge}>#{t.tramite_id}</span></td>
                <td style={styles.td}>{t.cuil}</td>
                <td style={styles.td}>
                  <span style={
                    (t.estado === 'PAGADA' || t.estado === 'EMITIDA') ? styles.badgePagada : 
                    (t.estado === 'RECHAZADA') ? styles.badgeRechazada : styles.badgePendiente
                  }>
                    {t.estado}
                  </span>
                </td>
                <td style={styles.td}>{t.fecha_solicitud}</td>
                <td style={styles.tdCentered}>
                  <div style={styles.actionGroup}>
                    {t.estado !== 'PAGADA' && t.estado !== 'PENDIENTE' && (
                      <p style={{ margin: 0, color: '#475569' }}>-----</p>
                    )}

                    {t.estado === 'PENDIENTE' && (
                      <button 
                        onClick={() => cambiarEstado(t.tramite_id, 'RECHAZADA')} 
                        style={styles.btnRechazar}
                      >
                        Rechazar
                      </button>
                    )}

                    {t.estado === 'PAGADA' && (
                      <button 
                        onClick={() => emitirCertificado(t.tramite_id)} 
                        style={styles.btnEmitir}
                      >
                        Emitir Certificado
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tramites.length === 0 && <p style={styles.noData}>No hay trámites para mostrar.</p>}
      </div>
    </div>
  );
};

// --- ESTILOS ADICIONALES ---
const styles = {
  // ... (tus estilos anteriores se mantienen, agrego/modifico los nuevos)
  container: { 
    width: '100%', 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '0 20px', 
    fontFamily: "'Inter', sans-serif", 
    marginTop: 15,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  filterBar: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  title: { margin: 0, color: '#fff', fontSize: '24px', fontWeight: '700' },
  subtitle: { margin: '5px 0 0 0', color: '#94a3b8', fontSize: '14px' },
  inputSearch: {
    padding: '10px 15px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    fontSize: '13px'
  },
  selectFilter: {
    padding: '10px 15px',
    backgroundColor: '#1e293b', // Fondo sólido para que se vea el texto en el dropdown
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '13px'
  },
  btnSearch: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s',
    '&:hover': { backgroundColor: '#2563eb' }
  },
  tableCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    overflow: 'hidden'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'center',
    padding: '15px 20px',
    backgroundColor: 'rgba(255,255,255,0.03)',
    color: '#64748b',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  tr: { borderBottom: '1px solid rgba(255,255,255,0.02)', transition: '0.2s' },
  td: { padding: '15px 20px', color: '#cbd5e1', fontSize: '14px', textAlign: 'center' },
  idBadge: { color: '#3b82f6', fontWeight: '600', fontFamily: 'monospace' },
  badgePagada: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    color: '#10b981',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  badgePendiente: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    color: '#f5690b',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  badgeRechazada: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '700'
  },
  btnRechazar: {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  btnEmitir: {
    padding: '6px 12px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600'
  },
  noData: { padding: '40px', color: '#475569', textAlign: 'center' },
  thCentered: { textAlign: 'center', padding: '15px 20px', backgroundColor: 'rgba(255, 255, 255, 0.03)', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' },
  tdCentered: { padding: '15px 20px', textAlign: 'center' },
  actionGroup: { display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' },
  btnLimpiar: {
    padding: '10px 15px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#94a3b8',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: '0.3s',
  },
};

export default OperadorDashboard;