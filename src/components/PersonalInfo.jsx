import React from 'react';
import { useFormContext } from 'react-hook-form';
import { maskPhone, maskCEP } from '../utils/masks';

function PersonalInfo() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="animate-fade-in">
      <h2 className="mb-8">Dados Pessoais</h2>
      
      <div className="grid-2">
        <div className="form-group">
          <label>Nome Completo *</label>
          <input type="text" {...register('fullName')} placeholder="Ex: João da Silva" />
          {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}
        </div>

        <div className="form-group">
          <label>Nome da Vaga *</label>
          <input type="text" {...register('nomeVaga')} placeholder="Ex: Desenvolvedor Senior" />
          {errors.nomeVaga && <span className="error-message">{errors.nomeVaga.message}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Idade</label>
          <input type="number" {...register('idade')} placeholder="Ex: 25" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} placeholder="Ex: joao@email.com" />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group" style={{ gridColumn: 'span 2 / span 2' }}>
          <label>Endereço</label>
          <div className="grid-2" style={{ gridTemplateColumns: '1fr 120px' }}>
            <input type="text" {...register('endereco')} placeholder="Rua, Avenida, etc." />
            <input type="text" {...register('numero')} placeholder="Nº" />
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="form-group">
          <label>Bairro</label>
          <input type="text" {...register('bairro')} />
        </div>
        <div className="form-group">
          <label>Cidade</label>
          <input type="text" {...register('cidade')} />
        </div>
        <div className="form-group">
          <label>CEP</label>
          <input 
            type="text" 
            {...register('cep')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskCEP(value);
            }}
            placeholder="00000-000"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Complemento</label>
        <input type="text" {...register('complemento')} placeholder="Apto, Bloco, etc." />
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Fone Celular *</label>
          <input 
            type="tel" 
            {...register('phone')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskPhone(value);
            }}
            placeholder="(00) 00000-0000" 
          />
          {errors.phone && <span className="error-message">{errors.phone.message}</span>}
        </div>
        <div className="form-group">
          <label>Fone Residencial</label>
          <input 
            type="tel" 
            {...register('foneRes')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskPhone(value);
            }}
            placeholder="(00) 0000-0000" 
          />
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label>Fone Recado</label>
          <input 
            type="tel" 
            {...register('foneRecado')} 
            onChange={(e) => {
              const { value } = e.target;
              e.target.value = maskPhone(value);
            }}
          />
        </div>
        <div className="form-group">
          <label>Falar com</label>
          <input type="text" {...register('falarCom')} />
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
