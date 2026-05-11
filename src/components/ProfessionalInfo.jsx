import React from 'react';
import { useFormContext } from 'react-hook-form';
import { maskCPF, maskPIS, maskRG, maskCNH } from '../utils/masks';

function ProfessionalInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="animate-fade-in">
      <h2 className="mb-8">Documentos e Perfil</h2>
      
      <div className="grid-2">
        <div className="form-group">
          <label>Data de Nascimento</label>
          <input type="date" {...register('dataNascimento')} />
        </div>
        <div className="form-group">
          <label>Estado Civil</label>
          <select {...register('estadoCivil')}>
            <option value="">Selecione...</option>
            <option value="Solteiro(a)">Solteiro(a)</option>
            <option value="Casado(a)">Casado(a)</option>
            <option value="Divorciado(a)">Divorciado(a)</option>
            <option value="Viúvo(a)">Viúvo(a)</option>
          </select>
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Estado Onde Nasceu</label>
          <input type="text" {...register('estadoNasceu')} placeholder="Ex: SP" />
        </div>
        <div className="form-group">
          <label>Cidade Onde Nasceu</label>
          <input type="text" {...register('cidadeNasceu')} />
        </div>
      </div>

      <div className="form-group">
        <label>Nome do Pai (sem abreviação)</label>
        <input type="text" {...register('nomePai')} />
      </div>

      <div className="form-group">
        <label>Nome da Mãe (sem abreviação)</label>
        <input type="text" {...register('nomeMae')} />
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label>Nº do RG</label>
          <input 
            type="text" 
            {...register('rg')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskRG(value);
            }}
            placeholder="00.000.000-0"
          />
        </div>
        <div className="form-group">
          <label>Data de Emissão do RG</label>
          <input type="date" {...register('rgDataEmissao')} />
        </div>
        <div className="form-group">
          <label>Estado Emissor do RG</label>
          <input type="text" {...register('rgEstadoEmissor')} />
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label>Nº da CNH</label>
          <input 
            type="text" 
            {...register('cnh')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskCNH(value);
            }}
            placeholder="00000000000"
          />
        </div>
        <div className="form-group">
          <label>Validade CNH</label>
          <input type="date" {...register('cnhValidade')} />
        </div>
        <div className="form-group">
          <label>Categoria CNH</label>
          <input type="text" {...register('cnhCategoria')} placeholder="Ex: AB" />
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label>CPF</label>
          <input 
            type="text" 
            {...register('cpf')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskCPF(value);
            }}
            placeholder="000.000.000-00" 
          />
          {errors.cpf && <span className="error-message">{errors.cpf.message}</span>}
        </div>
        <div className="form-group">
          <label>Raça / Cor</label>
          <input type="text" {...register('raca')} />
        </div>
        <div className="form-group">
          <label>PIS</label>
          <input 
            type="text" 
            {...register('pis')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskPIS(value);
            }}
            placeholder="000.00000.00-0"
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { id: 'trabalhouNaEmpresa', label: 'Já trabalhou na empresa?' },
            { id: 'parentesNaEmpresa', label: 'Possui familiares que trabalham na empresa?' },
            { id: 'portadorDeficiencia', label: 'Portador de deficiência?' },
            { id: 'trabalhoTurnos', label: 'Concorda em trabalhar em turnos de revezamento?' },
            { id: 'trabalhoTemporario', label: 'Aceita serviço por prazo determinado?' }
          ].map(item => (
            <label key={item.id} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              cursor: 'pointer',
              padding: '0.75rem 1rem',
              background: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              margin: 0,
              transition: 'var(--transition)'
            }}>
              <input 
                type="checkbox" 
                {...register(item.id)} 
                style={{ width: '1.25rem', height: '1.25rem', cursor: 'pointer' }}
              /> 
              <span style={{ fontSize: '0.925rem', fontWeight: '500' }}>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="form-group" style={{ marginTop: '1rem' }}>
        <label>Descreva (se necessário)</label>
        <textarea {...register('descreva')} rows="3" placeholder="Informações adicionais..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}></textarea>
      </div>
    </div>
  );
}

export default ProfessionalInfo;
