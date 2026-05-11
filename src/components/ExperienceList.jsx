import React from 'react';
import { useFormContext } from 'react-hook-form';

function ExperienceList() {
  const { register } = useFormContext();

  return (
    <div className="animate-fade-in">
      <h2 className="mb-8">Perfil Complementar</h2>

      <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Medidas para Uniforme</h3>
        <div className="grid-3">
          <div className="form-group">
            <label>Calça</label>
            <input type="text" {...register('tamanhoCalca')} placeholder="Ex: 42" />
          </div>
          <div className="form-group">
            <label>Camiseta</label>
            <input type="text" {...register('tamanhoCamiseta')} placeholder="Ex: M" />
          </div>
          <div className="form-group">
            <label>Sapato</label>
            <input type="text" {...register('tamanhoSapato')} placeholder="Ex: 40" />
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-xl)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', color: 'var(--text-main)' }}>Formação Acadêmica</h3>
        
        <div className="form-group">
          <label>Escolaridade</label>
          <select {...register('escolaridade')}>
            <option value="">Selecione...</option>
            <option value="Ensino Fundamental Completo">Ensino Fundamental Completo</option>
            <option value="Ensino Fundamental Incompleto">Ensino Fundamental Incompleto</option>
            <option value="Ensino Médio Completo">Ensino Médio Completo</option>
            <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
            <option value="Superior Completo">Superior Completo</option>
            <option value="Superior Incompleto">Superior Incompleto</option>
          </select>
        </div>

        <div className="form-group">
          <label>Outros Cursos & Certificações</label>
          <textarea 
            {...register('outrosCursos')} 
            rows="4" 
            placeholder="Liste cursos relevantes para a vaga..."
          />
        </div>

        <div className="grid-2">
          <div className="form-group">
            <label>Curso</label>
            <input type="text" {...register('curso')} />
          </div>
          <div className="form-group">
            <label>Ano</label>
            <input type="text" {...register('ano')} />
          </div>
        </div>

        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          cursor: 'pointer',
          marginTop: '1rem'
        }}>
          <input 
            type="checkbox" 
            {...register('continuaEstudando')} 
            style={{ width: '1.25rem', height: '1.25rem' }}
          /> 
          <span style={{ fontWeight: '500', fontSize: '0.925rem' }}>Ainda estou estudando</span>
        </label>
      </div>
    </div>
  );
}

export default ExperienceList;
