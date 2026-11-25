import React, { useEffect, useState } from 'react';
import adminApi from '../services/adminApi';
import { 
  Users, 
  UserCheck, 
  Clock, 
  Briefcase 
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid
} from 'recharts';

const STATUS_COLORS = {
  novo: '#3B82F6',
  em_analise: '#EAB308',
  entrevista_agendada: '#8B5CF6',
  aprovado: '#10B981',
  reprovado: '#EF4444',
  banco_de_talentos: '#6B7280',
  contratado: '#059669',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await adminApi.get('/api/admin/applications/dashboard', { params });
      setData(res.data);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (loading || !data) {
    return <div style={{ padding: '2rem' }}>Carregando dados estatísticos...</div>;
  }

  const { cards, porStatus, porVaga, porEntrevistador, timeline } = data;

  const cardItems = [
    { title: 'Total de Candidaturas', val: cards.total, icon: Users, color: '#004D4D' },
    { title: 'Novos (7 dias)', val: cards.ultimos7Dias, icon: Clock, color: '#3B82F6' },
    { title: 'Novos (30 dias)', val: cards.ultimos30Dias, icon: Briefcase, color: '#6366F1' },
    { title: 'Candidatos PCD', val: cards.pcdCount, icon: UserCheck, color: '#10B981' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>Dashboard R&S</h1>
          <p className="text-muted" style={{ fontSize: '0.875rem' }}>Visão geral dos processos seletivos e candidatos da Formel D</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="date"
            className="form-control"
            style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span style={{ color: 'var(--text-muted)' }}>até</span>
          <input
            type="date"
            className="form-control"
            style={{ width: 'auto', padding: '0.4rem 0.75rem' }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchMetrics} style={{ padding: '0.4rem 1rem' }}>
            Filtrar
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        {cardItems.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: `${c.color}15`,
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>{c.title}</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.2rem' }}>{c.val}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Inscrições por Dia (Últimos 14 dias)</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="data" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="var(--brand-primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Distribuição por Status</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={porStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {porStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Top Vagas Mais Concorridas</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porVaga} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="nomeVaga" type="category" stroke="var(--text-muted)" fontSize={12} width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--brand-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem' }}>Candidaturas por Entrevistador</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={porEntrevistador}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="entrevistador" stroke="var(--text-muted)" fontSize={11} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
