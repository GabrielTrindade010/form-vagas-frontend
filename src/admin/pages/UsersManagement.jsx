import React, { useState, useEffect } from 'react';
import adminApi from '../services/adminApi';
import { UserPlus, Shield, UserCheck, UserX, Key } from 'lucide-react';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('recrutador');
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/api/admin/applications/users/all');
      setUsers(res.data.users);
    } catch (err) {
      showToast('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post('/api/admin/applications/users/create', { nome, email, senha, role });
      showToast('Usuário cadastrado com sucesso!');
      setShowModal(false);
      setNome('');
      setEmail('');
      setSenha('');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao criar usuário.');
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.patch(`/api/admin/applications/users/${id}/toggle-status`);
      showToast('Status do usuário atualizado.');
      fetchUsers();
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao alterar status.');
    }
  };

  const handleResetPassword = async (id) => {
    const novaSenha = window.prompt('Digite a nova senha para o usuário (mínimo 6 caracteres):');
    if (!novaSenha) return;
    try {
      await adminApi.post(`/api/admin/applications/users/${id}/reset-password`, { novaSenha });
      showToast('Senha redefinida com sucesso!');
    } catch (err) {
      showToast(err.response?.data?.error || 'Erro ao redefinir senha.');
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Usuários Administrativos</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Gestão de acessos da equipe de R&S e Departamento Pessoal</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-muted)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Nome</th>
              <th style={{ padding: '0.75rem 1rem' }}>E-mail</th>
              <th style={{ padding: '0.75rem 1rem' }}>Perfil (Role)</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}>Último Acesso</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }} className="text-muted">Carregando usuários...</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: '600' }}>{u.nome}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{u.email}</td>
                  <td style={{ padding: '0.75rem 1rem', textTransform: 'capitalize' }}>{u.role}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      background: u.ativo ? '#ECFDF5' : '#FEF2F2',
                      color: u.ativo ? '#059669' : '#DC2626',
                    }}>
                      {u.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {u.ultimoLogin ? new Date(u.ultimoLogin).toLocaleString('pt-BR') : 'Nunca acessou'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                      <button
                        title="Redefinir Senha"
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem' }}
                        onClick={() => handleResetPassword(u.id)}
                      >
                        <Key size={16} />
                      </button>
                      <button
                        title={u.ativo ? 'Desativar Usuário' : 'Ativar Usuário'}
                        className="btn btn-ghost"
                        style={{ padding: '0.35rem', color: u.ativo ? 'var(--danger)' : 'var(--brand-primary)' }}
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.ativo ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Novo Usuário</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>Nome Completo</label>
                <input required className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>E-mail</label>
                <input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>Senha Inicial</label>
                <input required type="password" minLength={6} className="form-control" value={senha} onChange={(e) => setSenha(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '0.3rem' }}>Perfil</label>
                <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="recrutador">Recrutador (Visualizar e Editar)</option>
                  <option value="admin">Administrador (Total + Gestão Usuários)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Cadastrar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
