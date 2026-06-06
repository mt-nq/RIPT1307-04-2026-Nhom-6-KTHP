import { useState, useEffect } from 'react';
import { Form, Select, InputNumber, DatePicker, Input, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetEquipmentQuery } from '@/store/api/equipmentApi';
import { useCreateBorrowMutation } from '@/store/api/borrowApi';
import { BorrowCreateRequest } from '@/types';
import dayjs from 'dayjs';

export default function BorrowPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [createBorrow, { isLoading }] = useCreateBorrowMutation();
  const { data: eqData } = useGetEquipmentQuery({ search: '' });
  const equipment = eqData?.data || [];
  const [selectedEqId, setSelectedEqId] = useState<number | null>(null);
  const selectedEq = equipment.find(e => e.id === selectedEqId);

  useEffect(() => {
    if (location.state?.equipmentId) {
      setSelectedEqId(location.state.equipmentId);
      form.setFieldValue('equipmentId', location.state.equipmentId);
    }
  }, [location.state, form]);

  const handleSubmit = async (values: Record<string, unknown>) => {
    const request: BorrowCreateRequest = {
      equipmentId: values.equipmentId as number,
      quantity: values.quantity as number,
      borrowDate: (values.borrowDate as dayjs.Dayjs).format('YYYY-MM-DD'),
      returnDate: (values.returnDate as dayjs.Dayjs).format('YYYY-MM-DD'),
      note: values.note as string | undefined,
    };
    try {
      await createBorrow(request).unwrap();
      message.success('🎉 Gửi yêu cầu mượn thành công! Vui lòng chờ duyệt.');
      form.resetFields();
      navigate('/student/history');
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      message.error(error?.data?.message || 'Gửi yêu cầu thất bại');
    }
  };

  const noteItems = [
    { icon: 'fa-clock',              color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.18)',  text: 'Đơn sẽ được Admin duyệt trong vòng 24 giờ làm việc.' },
    { icon: 'fa-building',           color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.18)', text: 'Đến phòng CLB để nhận thiết bị sau khi được duyệt.' },
    { icon: 'fa-triangle-exclamation', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.18)',  text: 'Trả trễ hạn sẽ bị cấm mượn đồ trong 1 tháng.' },
    { icon: 'fa-shield-halved',      color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.18)', text: 'Người mượn chịu trách nhiệm bồi thường nếu làm hỏng, mất tài sản.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#141414', padding: '36px 4% 60px' }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* ── Back button ── */}
        <button
          onClick={() => navigate('/student/equipment')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#6b7280', fontSize: 13, fontWeight: 600,
            padding: 0, marginBottom: 32, transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#e5e7eb')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
        >
          <i className="fa-solid fa-arrow-left" />
          Quay lại kho thiết bị
        </button>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{ width: 46, height: 46, borderRadius: 10, background: 'linear-gradient(135deg,#5b5cf0,#4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(91, 92, 240,0.4)' }}>
            <i className="fa-solid fa-file-signature" style={{ color: '#fff', fontSize: 18 }} />
          </div>
          <div>
            <h1 style={{ fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
              Lập Phiếu Mượn Đồ
            </h1>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '4px 0 0' }}>
              Điền thông tin để ban quản trị CLB xét duyệt và cấp phát thiết bị.
            </p>
          </div>
        </div>

        {/* ── Grid layout ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

          {/* Form card */}
          <div style={{ background: '#1e1e1e', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', padding: '28px 30px' }}>
            {/* Section label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ width: 3, height: 18, background: '#5b5cf0', borderRadius: 2, display: 'block' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Thông tin yêu cầu</span>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit}
              initialValues={{ quantity: 1, borrowDate: dayjs() }} requiredMark={false}>

              <Form.Item name="equipmentId" label="Thiết bị muốn mượn"
                rules={[{ required: true, message: 'Vui lòng chọn thiết bị' }]}>
                <Select
                  showSearch placeholder="Chọn thiết bị..." optionFilterProp="label" size="large"
                  onChange={val => setSelectedEqId(val)}
                  options={equipment.map(eq => ({ value: eq.id, label: eq.name, disabled: eq.availableQuantity === 0 }))}
                />
              </Form.Item>

              <Form.Item name="quantity" label="Số lượng cần mượn"
                rules={[
                  { required: true, message: 'Vui lòng nhập số lượng' },
                  { validator: (_, v) => selectedEq && v > selectedEq.availableQuantity ? Promise.reject(`Chỉ còn ${selectedEq.availableQuantity} chiếc`) : Promise.resolve() },
                ]}>
                <InputNumber min={1} max={selectedEq?.availableQuantity || 99} size="large" style={{ width: '100%' }} />
              </Form.Item>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item name="borrowDate" label="Ngày mượn" rules={[{ required: true, message: 'Chọn ngày mượn' }]}>
                  <DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY"
                    disabledDate={d => d.isBefore(dayjs().startOf('day'))} />
                </Form.Item>
                <Form.Item name="returnDate" label="Ngày trả"
                  rules={[
                    { required: true, message: 'Chọn ngày trả' },
                    ({ getFieldValue }) => ({
                      validator(_, v) {
                        if (!v || v.isAfter(getFieldValue('borrowDate'))) return Promise.resolve();
                        return Promise.reject('Ngày trả phải sau ngày mượn');
                      },
                    }),
                  ]}>
                  <DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY"
                    disabledDate={d => d.isBefore(dayjs())} />
                </Form.Item>
              </div>

              <Form.Item name="note" label="Mục đích sử dụng & Ghi chú">
                <Input.TextArea rows={4} placeholder="Ghi rõ mục đích sử dụng (VD: Quay MV, Sự kiện tân sinh viên...)" style={{ resize: 'none' }} />
              </Form.Item>

              <button type="submit" disabled={isLoading}
                style={{
                  width: '100%', height: 48, borderRadius: 8, border: 'none',
                  background: isLoading ? '#2a2a2a' : 'linear-gradient(135deg,#5b5cf0,#4338ca)',
                  color: isLoading ? '#555' : '#fff',
                  fontSize: 14, fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: isLoading ? 'none' : '0 4px 18px rgba(91, 92, 240,0.4)',
                  transition: 'filter 0.2s',
                  marginTop: 4,
                }}
                onMouseEnter={e => { if (!isLoading) (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'; }}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = 'none'}
              >
                {isLoading
                  ? <><i className="fa-solid fa-spinner fa-spin" /> Đang xử lý...</>
                  : <><i className="fa-solid fa-paper-plane" /> Gửi Yêu Cầu Mượn</>}
              </button>
            </Form>
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Equipment preview */}
            {selectedEq ? (
              <div style={{ background: '#1e1e1e', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ position: 'relative', height: 150 }}>
                  {selectedEq.imageUrl ? (
                    <img src={selectedEq.imageUrl} alt={selectedEq.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-box" style={{ color: '#333', fontSize: 32 }} />
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #1e1e1e 0%, transparent 60%)' }} />
                  {/* Available badge */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: selectedEq.availableQuantity > 0 ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.85)',
                    color: '#fff', fontSize: 9, fontWeight: 800,
                    padding: '3px 8px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4,
                  }}>
                    <i className={`fa-solid fa-${selectedEq.availableQuantity > 0 ? 'check' : 'xmark'}`} style={{ fontSize: 8 }} />
                    {selectedEq.availableQuantity > 0 ? 'Khả dụng' : 'Hết hàng'}
                  </div>
                </div>
                <div style={{ padding: '4px 14px 14px' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 8 }}>{selectedEq.name}</div>
                  {selectedEq.description && (
                    <div style={{ fontSize: 11, color: '#6b7280', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {selectedEq.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '8px 12px' }}>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>Khả dụng</span>
                    <span style={{
                      fontSize: 13, fontWeight: 800,
                      color: selectedEq.availableQuantity > 0 ? '#10b981' : '#ef4444',
                    }}>
                      {selectedEq.availableQuantity} / {selectedEq.totalQuantity} chiếc
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ background: '#1e1e1e', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', padding: '32px 16px', textAlign: 'center', color: '#4b5563' }}>
                <i className="fa-solid fa-magnifying-glass" style={{ fontSize: 28, marginBottom: 10, display: 'block' }} />
                <div style={{ fontSize: 12, fontWeight: 600 }}>Chọn thiết bị để xem thông tin</div>
              </div>
            )}

            {/* Rules */}
            <div style={{ background: '#1e1e1e', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', padding: '16px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <span style={{ width: 3, height: 14, background: '#f59e0b', borderRadius: 2, display: 'block' }} />
                <span style={{ fontSize: 10, fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lưu ý quan trọng</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {noteItems.map((n, i) => (
                  <div key={i} style={{ background: n.bg, border: `1px solid ${n.border}`, borderRadius: 6, padding: '8px 10px', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                    <i className={`fa-solid ${n.icon}`} style={{ color: n.color, fontSize: 11, marginTop: 1, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.5 }}>{n.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
