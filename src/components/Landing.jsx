import React from 'react';
import { motion } from 'framer-motion';

function Landing({ onStart, theme, logo, logoWhite }) {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ maxWidth: '700px', padding: '0', overflow: 'hidden' }}
      >
        <div style={{ 
          height: '240px', 
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, #004D4D 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '2rem'
        }}>
          {/* Abstract background shapes */}
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '150px', height: '150px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '200px', height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          
          <img 
            src={theme === 'light' ? logoWhite : logo} 
            alt="Formel D Logo" 
            style={{ height: '80px', width: 'auto', position: 'relative', zIndex: 1 }} 
          />
        </div>

        <div style={{ padding: '3rem 2.5rem', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>Dados Cadastrais</h1>
          <p className="text-muted" style={{ fontStyle: 'justify', Size: '1.125rem', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            Seja bem-vindo ao formulário de solicitação de trabalho <strong>Formel D</strong>,<br></br>
            este formulário tem o objetivo de atualização de cadastro dos nossos canditatos. <br></br>
            Estamos em busca de talentos para integrar nossa equipe, <br></br>
            preencha o formulário para garantir sua participação no processo seletivo. <br></br>
            Levará apenas alguns minutos.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
            {[
              { icon: '📝', label: 'Dados Pessoais' },
              { icon: '📄', label: 'Documentação' },
              { icon: '🚀', label: 'Perfil Profissional' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-soft)' }}>{item.label}</div>
              </div>
            ))}
          </div>

          <button 
            onClick={onStart}
            className="btn btn-primary"
            style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}
          >
            Preencher Cadastro
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px' }}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
          
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ao iniciar, você concorda com nossos termos de privacidade e processamento de dados.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Landing;
