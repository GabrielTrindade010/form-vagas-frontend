import React from 'react';
import { useFormContext } from 'react-hook-form';

const interviewers = [
  'Diego Cavalcante',
  'Jailta Silva',
  'Leonardo Rocha',
  'Marcelo Capecci',
  'Marcos Mondim',
  'Rafael Alves',
  'Sidnei Trindade',
  'Flávio Silva'
].sort((a, b) => a.localeCompare(b));

function InterviewerSelection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="form-section">
      <h2 className="section-title">Escolha o seu entrevistador</h2>
      <p className="text-muted mb-6">Por favor, selecione o nome do entrevistador responsável pelo seu processo seletivo.</p>
      
      <div className="form-group">
        <label htmlFor="entrevistador">Entrevistador *</label>
        <select
          id="entrevistador"
          className={`form-control ${errors.entrevistador ? 'is-invalid' : ''}`}
          {...register('entrevistador')}
        >
          <option value="">Selecione um entrevistador...</option>
          {interviewers.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {errors.entrevistador && (
          <span className="error-message">{errors.entrevistador.message}</span>
        )}
      </div>
    </div>
  );
}

export default InterviewerSelection;
