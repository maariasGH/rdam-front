import { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import api from '../api';

const CitizenFlow = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Código, 3: Formulario
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const recaptchaRef = useRef(null); // Para obtener el token del captcha
  const [formData, setFormData] = useState({ nombre_solicitante: '', cuil: '', ciudad_solicitante: '', email_contacto: email, fecha_solicitud: '' });
  const navigate = useNavigate();

  const handleSendCode = async () => {
  const token = recaptchaRef.current.getValue();
    if (!token) {
        alert("Por favor, completa el captcha primero.");
        return;
    }

    try {
        // IMPORTANTE: Asegúrate de enviar los datos correctamente según tu endpoint
        await axios.post(`http://localhost:8000/api/auth/ciudadano/solicitar-codigo`, null, {
        params: { 
            email: email, 
            recaptcha_token: token 
        }
        });
        
        // Aquí es donde debería ocurrir el cambio de paso
        console.log("Éxito: Código enviado, cambiando a paso 2");
        setStep(2); 
        
    } catch (err) {
        console.error("Error en solicitud:", err);
        alert("Error: " + (err.response?.data?.detail || "Error desconocido"));
    }
  };
  const handleVerify = async () => {
    try {
        const res = await axios.post(`http://localhost:8000/api/auth/ciudadano/verificar?email=${email}&codigo=${code}`);
        
        // Guardamos el token en localStorage (invisible para el usuario)
        localStorage.setItem('citizen_token', res.data.access_token);
        
        // Pasamos al paso 3 (Formulario de solicitud)
        setStep(3);
    } catch (err) { alert("Código incorrecto o expirado"); }
  };
  const handleCreateTramite = async () => {
  // Construimos el objeto justo antes de enviar, 
  // asegurándonos de usar el valor más reciente del email
  const payload = {
    ...formData,
    email_contacto: email,
    fecha_solicitud: new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
  };

  try {
    await api.post('/api/tramites/crear', payload);
    alert("¡Trámite creado exitosamente!");
    navigate('/');
  } catch (err) {
    console.error("Error:", err.response?.data);
  }
};

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: 'auto' }}>
      {step === 1 && (
        <>
          <h2>Solicitar Certificado</h2>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      
            {/* 3. Renderizamos el Widget de Google */}
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey= "6LfWjogsAAAAABGwy8zMkJOBckD0DjweABMu6ewj" 
            />
            
            <button onClick={handleSendCode}>Solicitar Código</button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Ingresa el código enviado a tu email</h2>
          <input type="text" placeholder="XXXXXX" onChange={(e) => setCode(e.target.value)} />
          <button onClick={handleVerify}>Validar Identidad</button>
        </>
      )}
      {step === 3 && ( 
        <div style={{ textAlign: 'center' }}>
          <h2>Identidad validada ✅</h2>
          <h2>Completar solicitud</h2>
          <input placeholder="Nombre Completo" onChange={(e) => setFormData({...formData, nombre_solicitante: e.target.value})} />
          <input placeholder="CUIL" onChange={(e) => setFormData({...formData, cuil: e.target.value})} />
          <input placeholder="Ciudad" onChange={(e) => setFormData({...formData, ciudad_solicitante: e.target.value})} />
          <button onClick={handleCreateTramite}>Enviar Solicitud</button>
        </div>
      )}
    </div>
  );
};

export default CitizenFlow;