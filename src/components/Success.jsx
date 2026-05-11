import React from 'react';
import { motion } from 'framer-motion';
import { apiUrl } from '../config/api';

function Success({ data }) {
  const downloadPdf = async () => {
    try {
      const response = await fetch(apiUrl(`/api/applications/${data.id}/pdf`));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `curriculo_${data.fullName.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      window.open(apiUrl(`/api/applications/${data.id}/pdf`), '_blank');
    }
  };

  return (
    <div className="app-container">
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-card" 
        style={{ maxWidth: '600px', padding: '4rem', textAlign: 'center' }}
      >
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'var(--success-soft)', 
          color: 'var(--success)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 2rem',
          boxShadow: '0 0 0 8px rgba(16, 185, 129, 0.05)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        
        <h1 style={{ marginBottom: '1rem' }}>Candidatura Enviada!</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>
          Tudo certo, <strong>{data?.fullName || 'Candidato'}</strong>! Sua candidatura foi recebida com sucesso. 
        </p>
        <p className="text-muted" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
          Nossa equipe de recrutamento analisará suas informações e, caso seu perfil seja compatível com a vaga de <strong>{data?.nomeVaga}</strong>, entraremos em contato em breve. Agradecemos o interesse em fazer parte do nosso time!
        </p>

      </motion.div>
    </div>
  );
}

export default Success;
