const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Pedir email, 2: Pedir código

  const handleSendEmail = async () => {
    // POST a /api/auth/send-code
    await axios.post('http://localhost:8000/api/auth/send-code', { email });
    setStep(2);
  };

  const handleVerifyCode = async () => {
    // POST a /api/auth/verify -> Devuelve el JWT
    const response = await axios.post('http://localhost:8000/api/auth/verify', { email, code });
    localStorage.setItem('token', response.data.access_token);
    alert('¡Login exitoso! Ya puedes solicitar tu certificado.');
  };

  return (
    <div>
      {step === 1 ? (
        <>
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Tu email" />
          <button onClick={handleSendEmail}>Enviar Código</button>
        </>
      ) : (
        <>
          <input onChange={(e) => setCode(e.target.value)} placeholder="Código de 6 dígitos" />
          <button onClick={handleVerifyCode}>Validar y Entrar</button>
        </>
      )}
    </div>
  );
};