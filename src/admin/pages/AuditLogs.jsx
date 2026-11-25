import React, { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/api/admin/applications/audit/logs', { params: { page, limit: 15 } });
      setLogs(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Logs de Auditoria</h1>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Registro imutável de todas as ações administrativas, acessos e alterações</p>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Data/Hora</th>
              <th style={{ padding: '0.75rem 1rem' }}>Usuário</th>
              <th style={{ padding: '0.75rem 1rem' }}>Ação</th>
              <th style={{ padding: '0.75rem 1rem' }}>Entidade / ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">Carregando logs de auditoria...</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                    {new Date(log.createdAt).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>
                    {log.adminNome || 'Sistema / Anon'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: 'var(--bg-muted)',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}>
                      {log.acao}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {log.entidade} {log.entidadeId ? `(${log.entidadeId.slice(0, 8)}...)` : ''}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {log.ip || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
