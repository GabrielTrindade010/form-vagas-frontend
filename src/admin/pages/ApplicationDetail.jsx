import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminApi from '../services/adminApi';
import {
  ArrowLeft,
  Save,
  FileDown,
  Mail,
  Trash2,
  Plus,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [observacaoStatus, setObservacaoStatus] = useState('');
  const [activeTab, setActiveTab] = useState('identificacao');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get(`/api/admin/applications/${id}`);
      setApp(res.data);
      setStatus(res.data.status);
    } catch (err) {
      showToast('Erro ao carregar candidatura.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleChange = (field, value) => {
    setApp((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.put(`/api/admin/applications/${id}`, app);
      showToast('Candidatura salva com sucesso!');
      fetchDetail();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeStatus = async () => {
    try {
      await adminApi.patch(`/api/admin/applications/${id}/status`, {
        status,
        observacao: observacaoStatus,
      });
      showToast('Status atualizado com sucesso!');
      setObservacaoStatus('');
      fetchDetail();
    } catch (err) {
      showToast('Erro ao alterar status.');
    }
  };

  const handleAddExperience = () => {
    const newExp = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    };
    setApp((prev) => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExp],
    }));
  };

  const handleRemoveExperience = (index) => {
    setApp((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setApp((prev) => {
      const exps = [...(prev.experiences || [])];
      exps[index] = { ...exps[index], [field]: value };
      return { ...prev, experiences: exps };
    });
  };

  const handleResend = async () => {
    if (!window.confirm('Deseja reenviar o e-mail oficial com o PDF atualizado?')) return;
    try {
      await adminApi.post(`/api/admin/applications/${id}/resend-email`);
      showToast('E-mail reenviado com sucesso!');
    } catch (err) {
      showToast('Erro ao reenviar e-mail.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir esta candidatura?')) return;
    try {
      await adminApi.delete(`/api/admin/applications/${id}`);
      alert('Candidatura excluída.');
      navigate('/admin/candidaturas');
    } catch (err) {
      showToast('Erro ao excluir candidatura.');
    }
  };

  const handleAnonymize = async () => {
    const confirm = window.prompt(
      'DIREITO DE EXCLUSÃO LGPD: Esta ação anonimizará todos os dados pessoais do candidato de forma permanente. Digite "ANONIMIZAR" para confirmar:'
    );
    if (confirm !== 'ANONIMIZAR') return;
    try {
      await adminApi.delete(`/api/admin/applications/${id}/anonymize`);
      alert('Dados anonimizados e excluídos definitivamente.');
      navigate('/admin/candidaturas');
    } catch (err) {
      showToast('Erro ao anonimizar dados.');
    }
  };

  if (loading || !app) {
    return <div style={{ padding: '2rem' }}>Carregando dados da candidatura...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1100px' }}>
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'var(--brand-primary)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
        }}>
          {toast}
        </div>
      )}

      {/* Top action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/candidaturas')}>
            <ArrowLeft size={18} /> Voltar
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{app.fullName}</h1>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Vaga: {app.nomeVaga} • Entrevistador: {app.entrevistador}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a
            href={`${adminApi.defaults.baseURL}/api/admin/applications/${id}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            <FileDown size={16} /> Baixar PDF
          </a>
          <button className="btn btn-ghost" onClick={handleResend}>
            <Mail size={16} /> Reenviar E-mail
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>

      {/* Seção de Status e Observações Internas */}
      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', background: 'var(--bg-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <label style={{ fontWeight: '600', fontSize: '0.85rem' }}>Status Atual:</label>
          <select
            className="form-control"
            style={{ width: 'auto' }}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="novo">Novo</option>
            <option value="em_analise">Em Análise</option>
            <option value="entrevista_agendada">Entrevista Agendada</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
            <option value="banco_de_talentos">Banco de Talentos</option>
            <option value="contratado">Contratado</option>
          </select>
          <input
            type="text"
            placeholder="Motivo / Observação da mudança..."
            className="form-control"
            value={observacaoStatus}
            onChange={(e) => setObservacaoStatus(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="btn btn-primary" onClick={handleChangeStatus}>
            Atualizar Status
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'identificacao', label: '1. Identificação' },
          { id: 'documentos', label: '2. Documentos' },
          { id: 'perfil', label: '3. Perfil & Vaga' },
          { id: 'experiencias', label: '4. Experiências' },
          { id: 'historico', label: '5. Histórico de Mudanças' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Identificação */}
      {activeTab === 'identificacao' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Nome Completo</label>
            <input className="form-control" value={app.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Celular</label>
            <input className="form-control" value={app.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>E-mail</label>
            <input className="form-control" value={app.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Data Nascimento</label>
            <input type="date" className="form-control" value={app.dataNascimento || ''} onChange={(e) => handleChange('dataNascimento', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Endereço</label>
            <input className="form-control" value={app.endereco || ''} onChange={(e) => handleChange('endereco', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Número</label>
            <input className="form-control" value={app.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Bairro</label>
            <input className="form-control" value={app.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Cidade</label>
            <input className="form-control" value={app.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} />
          </div>
        </div>
      )}

      {/* Tab 2: Documentos */}
      {activeTab === 'documentos' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>CPF (Completo)</label>
            <input className="form-control" value={app.cpf || ''} onChange={(e) => handleChange('cpf', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>RG</label>
            <input className="form-control" value={app.rg || ''} onChange={(e) => handleChange('rg', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>PIS</label>
            <input className="form-control" value={app.pis || ''} onChange={(e) => handleChange('pis', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>CNH</label>
            <input className="form-control" value={app.cnh || ''} onChange={(e) => handleChange('cnh', e.target.value)} />
          </div>
        </div>
      )}

      {/* Tab 3: Perfil & Vaga */}
      {activeTab === 'perfil' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Vaga Pretendida</label>
            <input className="form-control" value={app.nomeVaga || ''} onChange={(e) => handleChange('nomeVaga', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Entrevistador</label>
            <input className="form-control" value={app.entrevistador || ''} onChange={(e) => handleChange('entrevistador', e.target.value)} />
          </div>
          <div>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Escolaridade</label>
            <input className="form-control" value={app.escolaridade || ''} onChange={(e) => handleChange('escolaridade', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="text-muted" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>Observações Internas (R&S)</label>
            <textarea
              rows={3}
              className="form-control"
              value={app.observacoesInternas || ''}
              onChange={(e) => handleChange('observacoesInternas', e.target.value)}
              placeholder="Anotações confidenciais sobre a entrevista ou perfil..."
            />
          </div>
        </div>
      )}

      {/* Tab 4: Experiências */}
      {activeTab === 'experiencias' && (
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Histórico de Experiências Profissionais</h3>
            <button className="btn btn-ghost" onClick={handleAddExperience}>
              <Plus size={16} /> Adicionar Experiência
            </button>
          </div>

          {(app.experiences || []).map((exp, idx) => (
            <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem' }}>Empresa</label>
                <input className="form-control" value={exp.company || ''} onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem' }}>Cargo</label>
                <input className="form-control" value={exp.position || ''} onChange={(e) => handleExperienceChange(idx, 'position', e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem' }}>Data Início</label>
                <input type="date" className="form-control" value={exp.startDate || ''} onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)} />
              </div>
              <div>
                <label className="text-muted" style={{ fontSize: '0.75rem' }}>Data Término</label>
                <input type="date" className="form-control" value={exp.endDate || ''} onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={() => handleRemoveExperience(idx)}>
                  <Trash2 size={16} /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Histórico */}
      {activeTab === 'historico' && (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Linha do Tempo de Status</h3>
          {(app.statusHistories || []).length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Nenhum histórico registrado ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {app.statusHistories.map((h, i) => (
                <div key={i} style={{ padding: '0.75rem', borderLeft: '3px solid var(--brand-primary)', background: 'var(--bg-muted)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Por: <strong>{h.adminNome || 'Admin'}</strong></span>
                    <span>{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                    {h.statusDe || 'Inicial'} &rarr; {h.statusPara}
                  </div>
                  {h.observacao && <div style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>"{h.observacao}"</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Zona de Perigo / LGPD */}
      <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontWeight: '700', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} /> Ações Críticas & LGPD
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exclusão normal (soft delete) ou anonimização definitiva conforme a Lei Geral de Proteção de Dados.
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost" style={{ color: 'var(--danger)' }} onClick={handleDelete}>
            <Trash2 size={16} /> Excluir Candidatura
          </button>
          <button className="btn" style={{ background: 'var(--danger)', color: '#fff' }} onClick={handleAnonymize}>
            Anonimizar (LGPD)
          </button>
        </div>
      </div>
    </div>
  );
}
