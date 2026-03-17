import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const MisTramites = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [tramites, setTramites] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' }); // { message, type: 'success' | 'error' }
  const recaptchaRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pagoStatus = params.get('status'); // Esto lee el ?pago=...
    const savedEmail = localStorage.getItem('user_email');

    if (savedEmail) {
      setEmail(savedEmail);
      cargarTramitesAutomaticamente(savedEmail);
    }

    // LÓGICA DE NOTIFICACIÓN MEJORADA
    if (pagoStatus === 'success') {
      setNotification({ message: "¡Pago procesado con éxito!", type: 'success' });
    } 
    else if (pagoStatus === 'error') {
      // Si el estado es 'error' pero el trámite ya aparece como PAGADO, 
      // es un error de redirección del Mock. 
      setNotification({ message: "Pago Rechazado o Cancelado.", type: 'error' });
    }

    // Limpiar la URL de parámetros para que no se repita el mensaje al refrescar
    if (pagoStatus) {
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-cerrar el cartel después de 4 segundos
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Función auxiliar para no repetir código
  const cargarTramitesAutomaticamente = async (emailAsociado) => {
    try {
      const resData = await axios.get(`http://localhost:8000/api/tramites/mis-solicitudes?email=${emailAsociado}`);
      setTramites(resData.data);
      setStep(3); // Forzamos el paso a la tabla
    } catch (err) {
      console.error("Error al cargar trámites persistentes", err);
      // Si falla (token expirado por ejemplo), volvemos al paso 1 y limpiamos
      localStorage.removeItem('user_email');
      setStep(1);
    }
  };

  // --- LÓGICA DE SOLICITUD DE CÓDIGO ---
  const handleSendCode = async () => {
    const recaptchaToken = recaptchaRef.current.getValue();
    if (!recaptchaToken) {
      alert("Por favor, completa el captcha primero.");
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/auth/ciudadano/solicitar-codigo`, null, {
        params: { email, recaptcha_token: recaptchaToken }
      });
      setStep(2);
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "No se pudo enviar el código"));
    }
  };

  // --- LÓGICA DE VERIFICACIÓN Y CARGA DE TRÁMITES ---
  const handleVerifyAndFetch = async () => {
    try {
      // 1. Verificar el código
      await axios.post(`http://localhost:8000/api/auth/ciudadano/verificar?email=${email}&codigo=${code}`);
      
      // 2. Persistir el email inmediatamente
      localStorage.setItem('user_email', email);
      
      // 3. LLAMADA CRÍTICA: Asegúrate de que el email no sea string vacío
      console.log("Buscando trámites para:", email);
      const resData = await axios.get(`http://localhost:8000/api/tramites/mis-solicitudes`, {
        params: { email: email } // Enviarlo como param explícito
      });
      
      console.log("Datos recibidos:", resData.data);
      setTramites(resData.data);
      setStep(3);
    } catch (err) {
      alert("Código incorrecto o error de conexión");
    }
  };
  const handlePagar = async (tramiteId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/pagos/checkout?tramite_id=${tramiteId}`);
      const { pluspagos_url, payload } = response.data;

      if (response.data.error) {
        alert("Error: " + response.data.error);
        return;
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = pluspagos_url;

      Object.keys(payload).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payload[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      setStep(3);
    } catch (err) {
      console.error("Error al iniciar checkout:", err);
      alert("Hubo un error al conectar con la pasarela de pagos.");
    }
  };

  const handleVerCertificado = async (tramiteId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/certificados/${tramiteId}`, {
        responseType: 'blob', 
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (err) {
      alert("No se pudo obtener el certificado. Asegúrate de que el trámite esté EMITIDA.");
    }
  };

  const handleNuevaConsulta = () => {
    // 1. Borramos el email del navegador
    localStorage.removeItem('user_email');
    
    // 2. Limpiamos los estados
    setEmail('');
    setCode('');
    setTramites([]);
    
    // 3. Volvemos al primer paso
    setStep(1);
    
    // 4. (Opcional) Limpiamos cualquier notificación pendiente
    setNotification({ message: '', type: '' });
  };

  return (
    <div style={styles.container}>
      {/* MENSAJE DE NOTIFICACIÓN DINÁMICO */}
      {notification.message && (
        <div style={{
          ...styles.notification,
          backgroundColor: notification.type === 'success' ? '#27ae60' : '#e74c3c'
        }}>
          {notification.message}
          <button onClick={() => setNotification({message:'', type:''})} style={styles.closeNotify}>×</button>
        </div>
      )}

      <div style={styles.card}>
        <h2 style={styles.title}>Mis Solicitudes</h2>
        
        {step === 1 && (
          <div style={styles.flowBox}>
            <p style={styles.subtitle}>Ingresa tu email para verificar tu identidad</p>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.inputFull}
            />
            <div style={styles.captchaContainer}>
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LfWjogsAAAAABGwy8zMkJOBckD0DjweABMu6ewj"
                />
            </div>
            <button onClick={handleSendCode} style={styles.button}>Solicitar Código</button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.flowBox}>
            <p style={styles.subtitle}>Ingresa el código enviado a <b>{email}</b></p>
            <input 
              type="text" 
              placeholder="XXXXXX" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.inputFull}
            />
            <button onClick={handleVerifyAndFetch} style={styles.button}>Verificar y Consultar</button>
            <button onClick={() => setStep(1)} style={styles.btnBack}>Volver</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.tableWrapper}>
            {tramites.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Fecha</th>
                    <th style={styles.th}>CUIL</th>
                    <th style={styles.th}>Estado</th>
                    <th style={styles.th}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {tramites.map((t) => (
                    <tr key={t.id} style={styles.tr}>
                      <td style={styles.td}>{t.nombre_solicitante}</td>
                      <td style={styles.td}>{t.fecha_solicitud}</td>
                      <td style={styles.td}>{t.cuil}</td>
                      <td style={styles.td}>
                        <span style={
                          (t.estado === 'PAGADA' || t.estado === 'EMITIDA') ? styles.badge : 
                          (t.estado === 'RECHAZADA') ? styles.badgeRechazada : styles.badgePendiente
                        }>
                          {t.estado}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {t.estado === 'PENDIENTE' ? (
                          <button onClick={() => handlePagar(t.tramite_id)} style={styles.btnPagar}>Pagar</button>
                        ) : t.estado === 'EMITIDA' ? (
                          <button onClick={() => handleVerCertificado(t.tramite_id)} style={styles.btnVer}>Ver Certificado</button>
                        ) : <span>-</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p style={styles.noData}>No tienes trámites registrados con este email.</p>
            )}
            <div style={styles.centerContainer}>
                  <button 
                    onClick={handleNuevaConsulta} 
                    style={styles.btnNuevaConsulta}
                  >
                    Nueva Consulta
                  </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

  const styles = {
    container: { 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      minHeight: '100vh', 
      paddingTop: '60px', 
      backgroundColor: '#0f172a', // Azul oscuro profundo
      fontFamily: "'Inter', system-ui, sans-serif" 
    },
    notification: {
      position: 'fixed', 
      top: '20px', 
      padding: '16px 24px', 
      borderRadius: '16px', 
      color: 'white', 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      gap: '15px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      backdropFilter: 'blur(10px)',
      fontWeight: '600'
    },
    closeNotify: { 
      background: 'none', 
      border: 'none', 
      color: 'white', 
      fontSize: '20px', 
      cursor: 'pointer', 
      opacity: '0.8' 
    },
    card: { 
      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
      backdropFilter: 'blur(12px)', 
      padding: '40px', 
      borderRadius: '24px', 
      width: '90%', 
      maxWidth: '900px', 
      border: '1px solid rgba(255, 255, 255, 0.08)', 
      textAlign: 'center',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
    },
    title: { 
      color: '#fff', 
      marginBottom: '10px', 
      fontSize: '32px', 
      fontWeight: '800',
      letterSpacing: '-0.5px'
    },
    subtitle: { 
      color: '#94a3b8', 
      marginBottom: '30px', 
      fontSize: '16px',
      fontWeight: '300'
    },
    flowBox: { 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px' 
    },
    inputFull: { 
      padding: '14px', 
      borderRadius: '12px', 
      border: '1px solid rgba(255, 255, 255, 0.1)', 
      backgroundColor: 'rgba(15, 23, 42, 0.6)', 
      color: '#fff', 
      width: '300px', 
      textAlign: 'center', 
      fontSize: '18px',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    button: { 
      padding: '14px 40px', 
      borderRadius: '12px', 
      border: 'none', 
      backgroundColor: '#3b82f6', 
      color: '#fff', 
      fontWeight: '700', 
      cursor: 'pointer',
      boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
      transition: 'transform 0.2s'
    },
    btnBack: { 
      background: 'none', 
      border: 'none', 
      color: '#64748b', 
      cursor: 'pointer', 
      marginTop: '10px', 
      fontSize: '14px',
      textDecoration: 'none' 
    },
    tableWrapper: { 
      marginTop: '20px', 
      overflowX: 'auto',
      width: '100%' 
    },
    table: { 
      width: '100%', 
      borderCollapse: 'separate', 
      borderSpacing: '0 8px' 
    },
    th: { 
      color: '#64748b', 
      padding: '12px', 
      fontSize: '13px', 
      textTransform: 'uppercase', 
      letterSpacing: '1px',
      fontWeight: '600'
    },
    tr: { 
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      transition: 'background-color 0.3s'
    },
    td: { 
      padding: '16px', 
      color: '#cbd5e1', 
      textAlign: 'center',
      fontSize: '15px',
      borderTop: '1px solid rgba(255, 255, 255, 0.03)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.03)'
    },
    badgePendiente: { 
      backgroundColor: 'rgba(245, 158, 11, 0.1)', 
      color: '#fbbf24', 
      padding: '6px 14px', 
      borderRadius: '20px', 
      border: '1px solid rgba(245, 158, 11, 0.2)', 
      fontSize: '12px',
      fontWeight: '600'
    },
    badgeRechazada: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '700'
    },
    badge: { 
      backgroundColor: 'rgba(34, 197, 94, 0.1)', 
      color: '#4ade80', 
      padding: '6px 14px', 
      borderRadius: '20px', 
      border: '1px solid rgba(34, 197, 94, 0.2)',
      fontSize: '12px',
      fontWeight: '600'
    },
    btnPagar: { 
      padding: '8px 18px', 
      borderRadius: '10px', 
      border: 'none', 
      backgroundColor: '#f59e0b', 
      color: '#000',
      cursor: 'pointer', 
      fontWeight: '700',
      fontSize: '13px'
    },
    btnVer: { 
      padding: '8px 18px', 
      borderRadius: '10px', 
      border: 'none', 
      backgroundColor: '#10b981', 
      color: '#fff', 
      cursor: 'pointer', 
      fontWeight: '700',
      fontSize: '13px'
    },
    noData: { 
      color: '#94a3b8', 
      margin: '40px 0',
      fontSize: '16px' 
    },
    centerContainer: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      marginTop: '40px',
    },
    btnNuevaConsulta: {
      padding: '12px 28px',
      backgroundColor: 'transparent',
      color: '#94a3b8',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
    },
    captchaContainer: { display: 'flex', justifyContent: 'center', margin: '20px 0', filter: 'invert(90%) hue-rotate(180deg) brightness(1.1)', opacity: '0.9' }
};

export default MisTramites;