import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

// Este componente renderiza seus filhos em um nó DOM fora da hierarquia normal
// Garante que modais apareçam sempre por cima de tudo
const Portal: React.FC<PortalProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Adiciona classe ao body para prevenir rolagem quando o portal está aberto
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restaura rolagem quando o portal é fechado
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  // Componente do lado do servidor ou antes da montagem
  if (!mounted) return null;
  
  // Porta para o final do documento garantindo posição por cima de tudo
  return createPortal(
    children,
    document.body
  );
};

export default Portal;
