import { Table, Select, Empty, Spin } from 'antd';
import { useState } from 'react';
import { useGetMyBorrowsQuery } from '@/store/api/borrowApi';
import { BorrowResponse, BorrowStatus } from '@/types';
import { BORROW_STATUS_LABELS } from '@/utils/constants';
import dayjs from 'dayjs';

const STATUS_STYLE: Record<BorrowStatus, { bg: string; border: string; color: string; dot: string }> = {
  PENDING:  { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  color: '#fbbf24', dot: '#f59e0b' },
  APPROVED: { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  color: '#60a5fa', dot: '#3b82f6' },
  RETURNED: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', color: '#34d399', dot: '#10b981' },
  OVERDUE:  { bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  color: '#f87171', dot: '#ef4444' },
  REJECTED: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)', color: '#6b7280', dot: '#4b5563' },
};

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState<BorrowStatus | 'ALL'>('ALL');
  const { data, isLoading } = useGetMyBorrowsQuery();
  const allBorrows = data?.data || [];
  const filtered = statusFilter === 'ALL' ? allBorrows : allBorrows.filter(b => b.status === statusFilter);

  const stats = [
    { label: 'Tổng Phiếu',  value: allBorrows.length,                                      color: '#e5e7eb', accent: '#e50914' },
    { label: 'Chờ Duyệt',   value: allBorrows.filter(b => b.status === 'PENDING').length,  color: '#fbbf24', accent: '#f59e0b' },
    { label: 'Đang Mượn',   value: allBorrows.filter(b => b.status === 'APPROVED').length, color: '#60a5fa', accent: '#3b82f6' },
    { label: 'Đã Trả',      value: allBorrows.filter(b => b.status === 'RETURNED').length, color: '#34d399', accent: '#10b981' },
    { label: 'Quá Hạn',     value: allBorrows.filter(b => b.status === 'OVERDUE').length,  color: '#f87171', accent: '#ef4444' },
  ];

  const columns = [
    {
      title: '#', key: 'index', width: 48, align: 'center' as const,
      render: (_: unknown, __: unknown, i: number) => (
        <span style={{ fontSize: 12, color: '#4b5563', fontWeight: 700 }}>{i + 1}</span>
      ),
    },
    {
      title: 'Thiết bị', dataIndex: 'equipmentName', key: 'equipmentName',
      render: (name: string, record: BorrowResponse) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.equipmentImageUrl ? (
            <img src={record.equipmentImageUrl} alt={name}
              style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 44, height: 44, background: '#2a2a2a', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fa-solid fa-box" style={{ color: '#444' }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#e5e7eb' }}>{name}</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>SL: {record.quantity} chiếc</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Thời gian', key: 'time',
      render: (_: unknown, record: BorrowResponse) => {
        const isOverdue = record.status === 'APPROVED' && dayjs(record.returnDate).isBefore(dayjs(), 'day');
        return (
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#9ca3af', marginBottom: 2 }}>
              <span style={{ color: '#6b7280' }}>Từ</span> <span style={{ color: '#d1d5db', fontWeight: 600 }}>{dayjs(record.borrowDate).format('DD/MM/YYYY')}</span>
            </div>
            <div style={{ color: isOverdue ? '#f87171' : '#9ca3af' }}>
              <span style={{ color: '#6b7280' }}>Đến</span>{' '}
              <span style={{ color: isOverdue ? '#f87171' : '#d1d5db', fontWeight: 600 }}>{dayjs(record.returnDate).format('DD/MM/YYYY')}</span>
              {isOverdue && <span style={{ marginLeft: 4 }}>⚠</span>}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status: BorrowStatus) => {
        const s = STATUS_STYLE[status];
        return (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: s.bg, border: `1px solid ${s.border}`,
            color: s.color, fontSize: 10, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.07em',
            padding: '4px 10px', borderRadius: 3,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.dot, flexShrink: 0, ...(status === 'PENDING' ? { animation: 'pulse 1.5s infinite' } : {}) }} />
            {BORROW_STATUS_LABELS[status]}
          </span>
        );
      },
    },
    {
      title: 'Ngày gửi', dataIndex: 'createdAt', key: 'createdAt',
      render: (date: string) => <span style={{ fontSize: 12, color: '#6b7280' }}>{dayjs(date).format('DD/MM/YYYY HH:mm')}</span>,
      sorter: (a: BorrowResponse, b: BorrowResponse) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix(),
    },
  ];

  if (isLoading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Spin size="large" />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#e5e7eb', padding: '40px 4%' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <div style={{ width: 4, height: 30, background: '#e50914', borderRadius: 2 }} />
              <h1 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                Lịch Sử Mượn Đồ
              </h1>
            </div>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0, paddingLeft: 16 }}>
              Theo dõi tiến trình và trạng thái các yêu cầu mượn thiết bị.
            </p>
          </div>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 200 }}
            size="large"
            options={[
              { value: 'ALL', label: 'Tất cả trạng thái' },
              ...Object.entries(BORROW_STATUS_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#1a1a1a', borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.06)',
              borderTop: `3px solid ${s.accent}`,
              padding: '16px 12px', textAlign: 'center',
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#222')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1a1a1a')}
            >
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: '#1a1a1a', borderRadius: 6,
          border: '1px solid rgba(255,255,255,0.06)',
          overflow: 'hidden',
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '60px 16px', textAlign: 'center' }}>
              <Empty description={<span style={{ color: '#4b5563', fontSize: 13, fontWeight: 600 }}>Không tìm thấy yêu cầu mượn nào</span>} image={Empty.PRESENTED_IMAGE_SIMPLE} />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filtered}
              rowKey="id"
              scroll={{ x: 700 }}
              pagination={{
                pageSize: 10,
                style: { padding: '12px 20px' },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
