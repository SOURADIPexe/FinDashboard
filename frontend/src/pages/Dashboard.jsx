import { useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, Activity, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899', '#14b8a6'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendPeriod, setTrendPeriod] = useState('monthly');

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchTrends();
  }, [trendPeriod]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, catRes, trendRes, activityRes] = await Promise.all([
        dashboardAPI.getSummary(),
        dashboardAPI.getCategoryBreakdown(),
        dashboardAPI.getTrends('monthly'),
        dashboardAPI.getRecentActivity(8),
      ]);
      setSummary(summaryRes.data.data);
      setCategoryData(catRes.data.data);
      setTrends(processTrends(trendRes.data.data));
      setRecentActivity(activityRes.data.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    try {
      const res = await dashboardAPI.getTrends(trendPeriod);
      setTrends(processTrends(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  const processTrends = (data) => {
    const map = {};
    data.forEach((item) => {
      const label = item.period.month
        ? `${item.period.year}-${String(item.period.month).padStart(2, '0')}`
        : `${item.period.year}-W${item.period.week}`;
      if (!map[label]) map[label] = { label, income: 0, expense: 0 };
      if (item.type === 'income') map[label].income = item.total;
      else map[label].expense = item.total;
    });
    return Object.values(map).sort((a, b) => a.label.localeCompare(b.label));
  };

  const preparePieData = () => {
    const grouped = {};
    categoryData.forEach(({ category, total }) => {
      grouped[category] = (grouped[category] || 0) + total;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(summary?.totalIncome || 0),
      icon: <TrendingUp size={22} />,
      color: 'var(--accent-green)',
      bg: 'rgba(16, 185, 129, 0.1)',
      arrow: <ArrowUpRight size={16} />,
    },
    {
      title: 'Total Expense',
      value: formatCurrency(summary?.totalExpense || 0),
      icon: <TrendingDown size={22} />,
      color: 'var(--accent-red)',
      bg: 'rgba(239, 68, 68, 0.1)',
      arrow: <ArrowDownRight size={16} />,
    },
    {
      title: 'Net Balance',
      value: formatCurrency(summary?.netBalance || 0),
      icon: <DollarSign size={22} />,
      color: summary?.netBalance >= 0 ? 'var(--accent-blue)' : 'var(--accent-red)',
      bg: summary?.netBalance >= 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
      arrow: summary?.netBalance >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />,
    },
    {
      title: 'Total Records',
      value: summary?.totalRecords || 0,
      icon: <Activity size={22} />,
      color: 'var(--accent-purple)',
      bg: 'rgba(139, 92, 246, 0.1)',
      arrow: null,
    },
  ];

  const customTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem',
      }}>
        <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '0.375rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Financial overview at a glance</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {cards.map((card, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: card.color }}>
                {card.icon}
              </div>
              {card.arrow && <span style={{ color: card.color }}>{card.arrow}</span>}
            </div>
            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{card.title}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: card.color }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Trend Chart */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Income vs Expense Trend</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['monthly', 'weekly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setTrendPeriod(p)}
                  className={trendPeriod === p ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="label" stroke="var(--text-muted)" fontSize={11} />
              <YAxis stroke="var(--text-muted)" fontSize={11} />
              <Tooltip content={customTooltip} />
              <Line type="monotone" dataKey="income" stroke="var(--accent-green)" strokeWidth={2} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="var(--accent-red)" strokeWidth={2} dot={{ r: 4 }} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown (Pie) */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Category Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={preparePieData()} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value">
                {preparePieData().map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val)} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontSize: '0.8rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Bar + Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Category Bars */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" stroke="var(--text-muted)" fontSize={11} />
              <YAxis type="category" dataKey="category" stroke="var(--text-muted)" fontSize={11} width={90} />
              <Tooltip content={customTooltip} />
              <Bar dataKey="total" name="Amount" radius={[0, 6, 6, 0]}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.type === 'income' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-card" style={{ padding: '1.25rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentActivity.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                No recent activity. Start by adding transactions.
              </p>
            )}
            {recentActivity.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.625rem 0.75rem', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)',
                  transition: 'background 0.2s',
                }}
              >
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.category}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {new Date(item.date).toLocaleDateString()} · {item.createdBy?.name || 'Unknown'}
                  </p>
                </div>
                <span style={{
                  fontSize: '0.875rem', fontWeight: 600,
                  color: item.type === 'income' ? 'var(--accent-green)' : 'var(--accent-red)',
                }}>
                  {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
