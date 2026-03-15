import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Volvemos al home
    window.location.reload(); // Refrescamos para limpiar estados globales
  };

  return (
    <button 
      onClick={handleLogout} 
      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
    >
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;