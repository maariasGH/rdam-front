import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../api';

const CitizenFlow = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos en segundos (15 * 60)
  const recaptchaRef = useRef(null);
  const [formData, setFormData] = useState({ 
    nombre_solicitante: '', 
    cuil: '', 
    ciudad_solicitante: '', 
    email_contacto: '', 
    fecha_solicitud: '' 
  });
  const navigate = useNavigate();

  // 3. Lógica del Contador
  useEffect(() => {
    // Solo inicia el contador cuando estamos en el paso 2 o 3 (cuando ya hay un código/token)
    if (step === 1) return;

    if (timeLeft === 0) {
      alert("La sesión ha expirado por seguridad.");
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // Limpieza al desmontar
  }, [timeLeft, step, navigate]);

  // Función para formatear segundos a MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // --- Lógica de peticiones ---
  const handleSendCode = async () => {
    const token = recaptchaRef.current.getValue();
    if (!token) { alert("Por favor, completa el captcha primero."); return; }
    try {
      await axios.post(`http://localhost:8000/api/auth/ciudadano/solicitar-codigo`, null, {
        params: { email: email, recaptcha_token: token }
      });
      setStep(2); 
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Error desconocido"));
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post(`http://localhost:8000/api/auth/ciudadano/verificar?email=${email}&codigo=${code}`);
      localStorage.setItem('citizen_token', res.data.access_token);
      setStep(3);
    } catch (err) { alert("Código incorrecto o expirado"); }
  };

  const handleCreateTramite = async () => {
    const payload = {
      ...formData,
      email_contacto: email,
      fecha_solicitud: new Date().toISOString().split('T')[0]
    };
    try {
      await api.post('/api/tramites/crear', payload);
      alert("¡Trámite creado exitosamente!");
      navigate('/');
    } catch (err) { console.error("Error:", err.response?.data); }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '85vh',
      fontFamily: "'Inter', system-ui, sans-serif",
      backgroundColor: '#0f172a',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(12px)',
      padding: '40px',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
      width: '100%',
      maxWidth: '450px',
      textAlign: 'center',
      position: 'relative' // Para el timer
    },
    timerBadge: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      fontSize: '12px',
      color: timeLeft < 60 ? '#f87171' : '#94a3b8', // Se pone rojo al último minuto
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: '5px 10px',
      borderRadius: '20px',
      border: timeLeft < 60 ? '1px solid #f87171' : '1px solid rgba(255,255,255,0.1)'
    },
    title: { color: '#fff', marginBottom: '10px', fontSize: '28px', fontWeight: '800' },
    subtitle: { color: '#94a3b8', marginBottom: '25px', fontSize: '15px' },
    input: {
      width: '100%',
      padding: '14px 16px',
      margin: '10px 0',
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      fontSize: '16px',
      color: '#fff',
      boxSizing: 'border-box',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'all 0.3s ease',
    },
    captchaContainer: { display: 'flex', justifyContent: 'center', margin: '20px 0', filter: 'invert(90%) hue-rotate(180deg) brightness(1.1)', opacity: '0.9' },
    successBadge: { backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', border: '1px solid rgba(74, 222, 128, 0.2)' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Mostramos el tiempo solo si ya pasamos el paso 1 */}
        {step > 1 && (
          <div style={styles.timerBadge}>
            Expira en: {formatTime(timeLeft)}
          </div>
        )}

        {step === 1 && (
          <>
            <h2 style={styles.title}>Solicitar Certificado</h2>
            <p style={styles.subtitle}>Ingresa tu correo para recibir un código de validación</p>
            <input 
              style={styles.input}
              type="email" 
              placeholder="correo@ejemplo.com" 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <div style={styles.captchaContainer}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LfWjogsAAAAABGwy8zMkJOBckD0DjweABMu6ewj" 
              />
            </div>
            <button style={styles.button} onClick={handleSendCode}>
              Enviar Código
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={styles.title}>Verifica tu Email</h2>
            <p style={styles.subtitle}>Ingresa el código enviado a {email}</p>
            <input 
              style={{...styles.input, textAlign: 'center', letterSpacing: '5px', fontSize: '20px'}}
              type="text" 
              maxLength="6"
              placeholder="000000" 
              onChange={(e) => setCode(e.target.value)} 
            />
            <button style={styles.button} onClick={handleVerify}>
              Validar Identidad
            </button>
          </>
        )}

        {step === 3 && ( 
          <div>
            <div style={styles.successBadge}>✅ Identidad Validada</div>
            <h2 style={styles.title}>Datos del Trámite</h2>
            <p style={styles.subtitle}>Completa la información antes de que expire el tiempo</p>
            <input 
              style={styles.input}
              placeholder="Nombre Completo" 
              onChange={(e) => setFormData({...formData, nombre_solicitante: e.target.value})} 
            />
            <input 
              style={styles.input}
              placeholder="CUIL (sin guiones)" 
              onChange={(e) => setFormData({...formData, cuil: e.target.value})} 
            />
            <input 
              style={styles.input}
              placeholder="Ciudad de residencia" 
              onChange={(e) => setFormData({...formData, ciudad_solicitante: e.target.value})} 
            />
            <button 
              style={{...styles.button, backgroundColor: '#27ae60'}} 
              onClick={handleCreateTramite}
            >
              Finalizar Solicitud
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenFlow;