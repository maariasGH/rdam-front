import { useState } from 'react';
import axios from 'axios';

const MisTramites = () => {
  const [email, setEmail] = useState('');
  const [tramites, setTramites] = useState([]);
  const [buscado, setBuscado] = useState(false);

  const consultarTramites = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/tramites/mis-solicitudes?email=${email}`);
      setTramites(res.data);
      setBuscado(true);
    } catch (err) {
      alert("Error al consultar trámites");
    }
  };

return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Mis Solicitudes</h2>
        <p style={styles.subtitle}>Consulta el estado de tus trámites registrados</p>
        
        <div style={styles.searchBox}>
          <input 
            type="email" 
            placeholder="ejemplo@correo.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />
          <button onClick={consultarTramites} style={styles.button}>
            Buscar
          </button>
        </div>

        {buscado && tramites.length > 0 ? (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
                <thead>
                    <tr>
                    <th style={styles.th}>Nombre Completo</th>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>CUIL</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acción</th> {/* Nueva columna */}
                    </tr>
                </thead>
                <tbody>
                    {tramites.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                        <td style={styles.td}>{t.nombre_solicitante}</td>
                        <td style={styles.td}>{t.fecha_solicitud}</td>
                        <td style={styles.td}>{t.cuil}</td>
                        <td style={styles.td}>
                        <span style={t.estado === 'PENDIENTE' || t.estado === 'RECHAZADA' || t.estado === 'EMITIDA_VENCIDA' ? styles.badgePendiente : styles.badge}>
                            {t.estado}
                        </span>
                        </td>
                        <td style={styles.td}>
                        {/* Lógica de botones según estado */}
                        {t.estado === 'PENDIENTE' ? (
                            <button 
                            onClick={() => alert(`Iniciando pago para trámite #${t.id}`)} 
                            style={styles.btnPagar}
                            >
                            Pagar
                            </button>
                        ) : t.estado === 'EMITIDA' ? (
                            <button 
                            onClick={() => alert(`Abriendo certificado del trámite #${t.id}`)} 
                            style={styles.btnVer}
                            >
                            Ver Certificado
                            </button>
                        ) : (
                            <span style={{ color: '#666' }}>-</span>
                        )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
          </div>
        ) : buscado && (
          <p style={styles.noData}>No se encontraron trámites para este correo.</p>
        )}
      </div>
    </div>
  );
};

// 2. Objeto de Estilos (Agregalo al final del archivo o fuera del componente)
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    paddingTop: '60px',
    backgroundColor: '#121212', // Fondo oscuro profundo
    fontFamily: 'Segoe UI, Roboto, sans-serif'
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    width: '90%',
    maxWidth: '700px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    textAlign: 'center'
  },
  title: { color: '#fff', marginBottom: '10px', fontSize: '28px' },
  subtitle: { color: '#aaa', marginBottom: '30px', fontSize: '14px' },
  searchBox: { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '40px' },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#222',
    color: '#fff',
    width: '60%',
    outline: 'none'
  },
  button: {
    padding: '12px 25px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  tableWrapper: { marginTop: '20px', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' },
  th: { color: '#888', textAlign: 'center', padding: '10px', borderBottom: '1px solid #333' },
  tr: { backgroundColor: 'rgba(255, 255, 255, 0.02)', transition: 'transform 0.2s' },
  td: { padding: '15px 10px', color: '#ddd', textAlign: 'center' },
  badgePendiente: {
    backgroundColor: '#f39c1233',
    color: '#f39c12',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    border: '1px solid #f39c12'
  },
  badge: {
    backgroundColor: '#27ae6033',
    color: '#27ae60',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  noData: { color: '#e74c3c', marginTop: '20px' },
  btnPagar: {
    padding: '6px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#ffc107', // Amarillo/Dorado para pago
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    transition: '0.3s'
  },
  btnVer: {
    padding: '6px 15px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#28a745', // Verde para éxito/ver
    color: '#fff',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '12px',
    transition: '0.3s'
  },
  // Ajuste para que la tabla sea más cómoda con la nueva columna
  table: { width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' },
};

export default MisTramites;