import React from 'react';
import { useFormContext } from 'react-hook-form';

function Review() {
  const { getValues } = useFormContext();
  const values = getValues();

  const SummarySection = ({ title, children }) => (
    <div style={{ 
      padding: '1.5rem', 
      background: 'var(--bg-muted)', 
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-light)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--brand-primary)' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {children}
      </div>
    </div>
  );

  const DataItem = ({ label, value }) => (
    <div>
      <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{label}</p>
      <p style={{ fontSize: '0.925rem', fontWeight: '500', color: 'var(--text-main)' }}>{value || '—'}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <h2 className="mb-8">Revisão</h2>
      <p className="text-muted mb-8">Por favor, revise suas informações antes de enviar a candidatura.</p>

      <SummarySection title="Dados Pessoais">
        <DataItem label="Nome Completo" value={values.fullName} />
        <DataItem label="Vaga" value={values.nomeVaga} />
        <DataItem label="Celular" value={values.phone} />
        <DataItem label="Email" value={values.email} />
        <DataItem label="Endereço" value={`${values.endereco || ''}, ${values.numero || ''} ${values.complemento ? `- ${values.complemento}` : ''}`} />
        <DataItem label="Bairro/Cidade" value={`${values.bairro || ''} / ${values.cidade || ''}`} />
        <DataItem label="CEP" value={values.cep} />
      </SummarySection>

      <SummarySection title="Documentos e Perfil">
        <DataItem label="Data de Nascimento" value={values.dataNascimento} />
        <DataItem label="Idade" value={values.idade} />
        <DataItem label="Nome da Mãe" value={values.nomeMae} />
        <DataItem label="RG" value={`${values.rg || ''} (Emissão: ${values.rgDataEmissao || ''} - ${values.rgEstadoEmissor || ''})`} />
        <DataItem label="CNH" value={`${values.cnh || ''} (Cat: ${values.cnhCategoria || ''} - Val: ${values.cnhValidade || ''})`} />
        <DataItem label="Trabalho Temporário" value={values.trabalhoTemporario ? 'Aceita' : 'Não aceita'} />
        <DataItem label="Turnos" value={values.trabalhoTurnos ? 'Sim' : 'Não'} />
        <DataItem label="Observações" value={values.descreva} />
      </SummarySection>

      <SummarySection title="Perfil Complementar">
        <DataItem label="Escolaridade" value={values.escolaridade} />
        <DataItem label="Curso/Ano" value={`${values.curso || ''} / ${values.ano || ''}`} />
        <DataItem label="Uniforme" value={`C: ${values.tamanhoCalca || '—'} / T: ${values.tamanhoCamiseta || '—'} / S: ${values.tamanhoSapato || '—'}`} />
        <DataItem label="Estudando" value={values.continuaEstudando ? 'Sim' : 'Não'} />
      </SummarySection>
    </div>
  );
}

export default Review;
