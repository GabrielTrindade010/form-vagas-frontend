import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../services/adminApi';
import { 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Mail, 
  FileDown, 
  CheckSquare, 
  Square, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

const STATUS_LABELS = {
  novo: { label: 'Novo', color: '#3B82F6', bg: '#EFF6FF' },
  em_analise: { label: 'Em Análise', color: '#CA8A04', bg: '#FEFCE8' },
  entrevista_agendada: { label: 'Entrevista', color: '#7C3AED', bg: '#F5F3FF' },
  aprovado: { label: 'Aprovado', color: '#059669', bg: '#ECFDF5' },
  reprovado: { label: 'Reprovado', color: '#DC2626', bg: '#FEF2F2' },
  banco_de_talentos: { label: 'Banco Talentos', color: '#4B5563', bg: '#F3F4F6' },
  contratado: { label: 'Contratado', color: '#047857', bg: '#D1FAE5' },
};

export default function ApplicationsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtros
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [entrevistador, setEntrevistador] = useState('');
  const [nomeVaga, setNomeVaga] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        entrevistador: entrevistador || undefined,
        nomeVaga: nomeVaga || undefined,
      };
      const res = await adminApi.get('/api/admin/applications', { params });
      setData(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      showToast('Erro ao carregar candidaturas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page, status, entrevistador]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map((d) => d.id));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkStatusChange = async () => {
    if (!bulkStatus || selectedIds.length === 0) return;
    try {
      await adminApi.post('/api/admin/applications/bulk', {
        action: 'change_status',
        ids: selectedIds,
        status: bulkStatus,
      });
      showToast(`Status atualizado para ${selectedIds.length} candidatos!`);
      setBulkStatus('');
      fetchApplications();
    } catch (err) {
      showToast('Falha ao atualizar em lote.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Tem certeza que deseja excluir ${selectedIds.length} candidatura(s)?`)) return;
    try {
      await adminApi.post('/api/admin/applications/bulk', {
        action: 'delete',
        ids: selectedIds,
      });
      showToast('Candidaturas excluídas com sucesso.');
      fetchApplications();
    } catch (err) {
      showToast('Erro ao excluir em lote.');
    }
  };

  const handleExport = (format) => {
    const url = `${adminApi.defaults.baseURL}/api/admin/applications/export?format=${format}&search=${search}&status=${status}&entrevistador=${entrevistador}`;
    window.open(url, '_blank');
  };

  const handleResendEmail = async (id, nome) => {
    if (!window.confirm(`Deseja reenviar o e-mail da ficha de ${nome}?`)) return;
    try {
      await adminApi.post(`/api/admin/applications/${id}/resend-email`);
      showToast(`E-mail reenviado com sucesso para ${nome}!`);
    } catch (err) {
      showToast('Erro ao reenviar e-mail.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Candidaturas</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total de {total} registros encontrados</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost" onClick={() => handleExport('csv')}>
            <Download size={16} /> Exportar CSV
          </button>
          <button className="btn btn-ghost" onClick={() => handleExport('xlsx')}>
            <Download size={16} /> Exportar XLSX
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              placeholder="Buscar por nome, CPF, vaga ou telefone..."
              className="form-control"
              style={{ paddingLeft: '2.5rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>

        <select
          className="form-control"
          style={{ width: 'auto' }}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
        >
          <option value="">Todos os Status</option>
          <option value="novo">Novo</option>
          <option value="em_analise">Em Análise</option>
          <option value="entrevista_agendada">Entrevista Agendada</option>
          <option value="aprovado">Aprovado</option>
          <option value="reprovado">Reprovado</option>
          <option value="banco_de_talentos">Banco de Talentos</option>
          <option value="contratado">Contratado</option>
        </select>
      </div>

      {selectedIds.length > 0 && (
        <div style={{
          background: 'var(--brand-primary)',
          color: '#fff',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>{selectedIds.length} selecionado(s)</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select
              className="form-control"
              style={{ width: 'auto', background: '#fff', color: '#000' }}
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value)}
            >
              <option value="">Alterar Status para...</option>
              <option value="novo">Novo</option>
              <option value="em_analise">Em Análise</option>
              <option value="entrevista_agendada">Entrevista Agendada</option>
              <option value="aprovado">Aprovado</option>
              <option value="reprovado">Reprovado</option>
              <option value="banco_de_talentos">Banco de Talentos</option>
              <option value="contratado">Contratado</option>
            </select>
            <button className="btn" style={{ background: '#fff', color: 'var(--brand-primary)' }} onClick={handleBulkStatusChange}>
              Aplicar
            </button>
            <button className="btn btn-ghost" style={{ color: '#fff' }} onClick={handleBulkDelete}>
              <Trash2 size={16} /> Excluir
            </button>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem', width: '40px' }}>
                <button onClick={toggleSelectAll} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {selectedIds.length > 0 && selectedIds.length === data.length ? <CheckSquare size={16} /> : <Square size={16} />}
                </button>
              </th>
              <th style={{ padding: '0.75rem 1rem' }}>Candidato</th>
              <th style={{ padding: '0.75rem 1rem' }}>Vaga</th>
              <th style={{ padding: '0.75rem 1rem' }}>Entrevistador</th>
              <th style={{ padding: '0.75rem 1rem' }}>Celular</th>
              <th style={{ padding: '0.75rem 1rem' }}>Cidade</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Data</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">
                  Carregando candidaturas...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">
                  Nenhuma candidatura encontrada com os filtros selecionados.
                </td>
              </tr>
            ) : (
              data.map((app) => {
                const isSelected = selectedIds.includes(app.id);
                const st = STATUS_LABELS[app.status] || STATUS_LABELS.novo;
                return (
                  <tr key={app.id} style={{ borderBottom: '1px solid var(--border-color)', background: isSelected ? 'var(--bg-muted)' : 'transparent' }}>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <button onClick={() => toggleSelect(app.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        {isSelected ? <CheckSquare size={16} color="var(--brand-primary)" /> : <Square size={16} color="var(--text-muted)" />}
                      </button>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{app.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.cpfMascarado || 'Doc não informado'}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{app.nomeVaga}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{app.entrevistador}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{app.phone}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{app.cidade || '-'}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: st.color,
                        background: st.bg,
                      }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(app.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <Link to={`/admin/candidaturas/${app.id}`} title="Ver Detalhes e Editar" className="btn btn-ghost" style={{ padding: '0.35rem' }}>
                          <Eye size={16} />
                        </Link>
                        <a
                          href={`${adminApi.defaults.baseURL}/api/admin/applications/${app.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          title="Baixar PDF Sob Demanda"
                          className="btn btn-ghost"
                          style={{ padding: '0.35rem' }}
                        >
                          <FileDown size={16} />
                        </a>
                        <button
                          title="Reenviar E-mail"
                          onClick={() => handleResendEmail(app.id, app.fullName)}
                          className="btn btn-ghost"
                          style={{ padding: '0.35rem' }}
                        >
                          <Mail size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Página {page} de {totalPages || 1}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn btn-ghost"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <button
            className="btn btn-ghost"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Próxima <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
