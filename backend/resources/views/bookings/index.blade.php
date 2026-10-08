@extends('layouts.app')

@section('title', 'Quản Lý Đặt Phòng Khách Sạn | Lumière Hotel')

@section('styles')
<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.25rem;
    margin-bottom: 2rem;
  }
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    backdrop-filter: blur(12px);
  }
  .stat-icon {
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.8rem;
    border-radius: 12px;
  }
  .stat-val {
    font-size: 1.6rem;
    font-weight: 800;
    font-family: var(--font-serif);
    color: var(--text-main);
  }
  .stat-label {
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  /* Table Controls */
  .table-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }
  .search-form {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    max-width: 500px;
  }
  .search-input {
    flex: 1;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--border-glass);
    color: #fff;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
  }
  .search-input:focus {
    outline: none;
    border-color: var(--gold-primary);
  }
  .filter-select {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--border-glass);
    color: #fff;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    font-size: 0.85rem;
  }

  /* Table */
  .table-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    overflow: hidden;
    backdrop-filter: blur(12px);
  }
  .custom-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.85rem;
  }
  .custom-table th {
    background: rgba(0, 0, 0, 0.4);
    color: var(--text-muted);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.72rem;
    letter-spacing: 0.8px;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-glass);
  }
  .custom-table td {
    padding: 1.1rem 1.25rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    vertical-align: middle;
  }
  .custom-table tr:hover td {
    background: rgba(255, 255, 255, 0.02);
  }

  .booking-code {
    font-family: monospace;
    font-weight: 700;
    color: var(--gold-light);
    font-size: 0.95rem;
  }
  .badge-room {
    background: rgba(6, 182, 212, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(6, 182, 212, 0.3);
    padding: 0.25rem 0.6rem;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    text-decoration: none;
  }
  .badge-room:hover {
    background: rgba(6, 182, 212, 0.3);
  }

  .status-badge {
    padding: 0.3rem 0.7rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 700;
    display: inline-block;
  }
  .status-confirmed { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
  .status-pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
  .status-completed { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
  .status-cancelled { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }

  .actions-cell {
    display: flex;
    gap: 0.4rem;
  }
  .btn-action {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-glass);
    color: var(--text-main);
    padding: 0.4rem 0.65rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s;
  }
  .btn-action:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  .btn-action.approve:hover {
    background: rgba(16, 185, 129, 0.3);
    color: #34d399;
  }
  .btn-action.cancel:hover {
    background: rgba(239, 68, 68, 0.3);
    color: #f87171;
  }

  /* Modal */
  .modal-backdrop {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }
  .modal-backdrop.open { display: flex; }
  .modal-box {
    background: #0f172a;
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    width: 90%;
    max-width: 600px;
    padding: 2rem;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-glass);
  }
  .form-group {
    margin-bottom: 1rem;
  }
  .form-label {
    display: block;
    font-size: 0.8rem;
    color: var(--text-muted);
    font-weight: 600;
    margin-bottom: 0.35rem;
  }
  .form-input, .form-select, .form-textarea {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid var(--border-glass);
    color: #fff;
    padding: 0.65rem 0.85rem;
    border-radius: 8px;
    font-size: 0.85rem;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    outline: none;
    border-color: var(--gold-primary);
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
</style>
@endsection

@section('content')
  <!-- Thống Kê Nhanh -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon">📋</div>
      <div>
        <div class="stat-val">{{ $stats['total_bookings'] }}</div>
        <div class="stat-label">Tổng Đơn Đặt Phòng</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">💰</div>
      <div>
        <div class="stat-val" style="color: var(--gold-light);">{{ number_format($stats['total_revenue'], 0, ',', '.') }}₫</div>
        <div class="stat-label">Doanh Thu Dự Kiến</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">⏳</div>
      <div>
        <div class="stat-val" style="color: #fbbf24;">{{ $stats['pending_count'] }}</div>
        <div class="stat-label">Đơn Chờ Xác Nhận</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon">✅</div>
      <div>
        <div class="stat-val" style="color: #34d399;">{{ $stats['confirmed_count'] }}</div>
        <div class="stat-label">Đơn Đã Xác Nhận</div>
      </div>
    </div>
  </div>

  <!-- Thanh Điều Khiển & Bộ Lọc -->
  <div class="table-controls">
    <form action="{{ route('bookings.index') }}" method="GET" class="search-form">
      <input type="text" name="search" class="search-input" placeholder="Tìm theo mã đơn, tên khách hoặc SĐT..." value="{{ request('search') }}">
      <select name="status" class="filter-select" onchange="this.form.submit()">
        <option value="">-- Tất cả trạng thái --</option>
        <option value="confirmed" {{ request('status') === 'confirmed' ? 'selected' : '' }}>Đã xác nhận</option>
        <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Chờ duyệt</option>
        <option value="completed" {{ request('status') === 'completed' ? 'selected' : '' }}>Hoàn tất</option>
        <option value="cancelled" {{ request('status') === 'cancelled' ? 'selected' : '' }}>Đã hủy</option>
      </select>
      <button type="submit" class="btn-action" style="padding: 0 1rem;">Tìm</button>
    </form>

    <div style="display: flex; gap: 0.75rem;">
      <a href="{{ route('room.360') }}" class="btn-portal">
        <span>🌐</span> Xem 360° Các Phòng
      </a>
      <button class="btn-gold" onclick="openBookingModal()">
        <span>➕</span> Đặt Phòng Mới
      </button>
    </div>
  </div>

  <!-- Bảng Danh Sách Đặt Phòng -->
  <div class="table-card">
    <table class="custom-table">
      <thead>
        <tr>
          <th>Mã Đơn</th>
          <th>Phòng</th>
          <th>Khách Hàng</th>
          <th>Thời Gian Lưu Trú</th>
          <th>Tổng Tiền</th>
          <th>Trạng Thái</th>
          <th>Thao Tác</th>
        </tr>
      </thead>
      <tbody>
        @forelse($bookings as $booking)
          <tr>
            <td>
              <span class="booking-code">{{ $booking->booking_code }}</span>
            </td>
            <td>
              <div style="font-weight: 700; margin-bottom: 0.25rem;">{{ $booking->room->name ?? 'Phòng #' . $booking->room_id }}</div>
              <a href="{{ route('room.360', $booking->room_id) }}" class="badge-room" title="Bấm để xem không gian 360 độ của phòng này">
                <span>🌐</span> Xem Tour 360°
              </a>
            </td>
            <td>
              <div style="font-weight: 600;">{{ $booking->customer_name }}</div>
              <div style="color: var(--text-muted); font-size: 0.78rem;">📞 {{ $booking->customer_phone }}</div>
              @if($booking->customer_email)
                <div style="color: var(--text-muted); font-size: 0.75rem;">✉️ {{ $booking->customer_email }}</div>
              @endif
            </td>
            <td>
              <div>{{ \Carbon\Carbon::parse($booking->check_in_date)->format('d/m/Y') }} ➔ {{ \Carbon\Carbon::parse($booking->check_out_date)->format('d/m/Y') }}</div>
              <div style="color: var(--gold-light); font-size: 0.75rem; font-weight: 600;">{{ $booking->nights }} đêm ({{ $booking->guests_count }} khách)</div>
            </td>
            <td>
              <div style="font-weight: 800; color: var(--gold-light); font-size: 0.95rem;">
                {{ number_format($booking->total_price, 0, ',', '.') }}₫
              </div>
              <div style="font-size: 0.75rem; color: {{ $booking->payment_status === 'paid' ? '#34d399' : '#fbbf24' }};">
                {{ $booking->payment_status === 'paid' ? '● Đã thanh toán' : '○ Chưa thanh toán' }}
              </div>
            </td>
            <td>
              <span class="status-badge status-{{ $booking->status }}">
                @if($booking->status === 'confirmed')
                  ✓ Đã Xác Nhận
                @elseif($booking->status === 'pending')
                  ⏳ Chờ Duyệt
                @elseif($booking->status === 'completed')
                  ★ Hoàn Tất
                @else
                  ✕ Đã Hủy
                @endif
              </span>
            </td>
            <td>
              <div class="actions-cell">
                @if($booking->status !== 'confirmed')
                  <form action="{{ route('bookings.status', $booking->id) }}" method="POST" style="display:inline;">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="status" value="confirmed">
                    <button type="submit" class="btn-action approve" title="Duyệt đơn">✓ Duyệt</button>
                  </form>
                @endif

                @if($booking->status !== 'cancelled')
                  <form action="{{ route('bookings.status', $booking->id) }}" method="POST" style="display:inline;" onsubmit="return confirm('Bạn có chắc muốn hủy đơn này?');">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="status" value="cancelled">
                    <button type="submit" class="btn-action cancel" title="Hủy đơn">✕ Hủy</button>
                  </form>
                @endif

                <form action="{{ route('bookings.destroy', $booking->id) }}" method="POST" style="display:inline;" onsubmit="return confirm('Xóa vĩnh viễn đơn đặt phòng này?');">
                  @csrf
                  @method('DELETE')
                  <button type="submit" class="btn-action cancel" title="Xóa đơn">🗑️</button>
                </form>
              </div>
            </td>
          </tr>
        @empty
          <tr>
            <td colspan="7" style="text-align: center; padding: 3rem; color: var(--text-muted);">
              Chưa có đơn đặt phòng nào phù hợp với bộ lọc tìm kiếm.
            </td>
          </tr>
        @endforelse
      </tbody>
    </table>
  </div>

  <!-- Modal Đặt Phòng Mới -->
  <div id="bookingModal" class="modal-backdrop" onclick="if(event.target === this) closeBookingModal()">
    <div class="modal-box">
      <div class="modal-header">
        <h2 style="font-family: var(--font-serif); font-size: 1.25rem;">➕ Thêm Đơn Đặt Phòng Mới</h2>
        <button onclick="closeBookingModal()" style="background:none; border:none; color:#fff; font-size:1.2rem; cursor:pointer;">✕</button>
      </div>

      <form action="{{ route('bookings.store') }}" method="POST">
        @csrf

        <div class="form-group">
          <label class="form-label">Chọn Hạng Phòng:</label>
          <select name="room_id" class="form-select" required>
            @foreach($rooms as $r)
              <option value="{{ $r->id }}">P.{{ $r->room_number }} - {{ $r->name }} ({{ number_format($r->price, 0, ',', '.') }}₫ / đêm)</option>
            @endforeach
          </select>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Tên Khách Hàng:</label>
            <input type="text" name="customer_name" class="form-input" required placeholder="Nguyễn Văn A">
          </div>
          <div class="form-group">
            <label class="form-label">Số Điện Thoại:</label>
            <input type="text" name="customer_phone" class="form-input" required placeholder="0901234567">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Khách Hàng (Không bắt buộc):</label>
          <input type="email" name="customer_email" class="form-input" placeholder="khachhang@gmail.com">
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label class="form-label">Ngày Nhận Phòng (Check-in):</label>
            <input type="date" name="check_in_date" class="form-input" required value="{{ date('Y-m-d') }}">
          </div>
          <div class="form-group">
            <label class="form-label">Ngày Trả Phòng (Check-out):</label>
            <input type="date" name="check_out_date" class="form-input" required value="{{ date('Y-m-d', strtotime('+1 day')) }}">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Số Lượng Khách:</label>
          <input type="number" name="guests_count" class="form-input" value="2" min="1" max="10">
        </div>

        <div class="form-group">
          <label class="form-label">Ghi Chú & Yêu Cầu Đặc Biệt:</label>
          <textarea name="special_requests" class="form-textarea" rows="2" placeholder="Yêu cầu tầng cao, đón sân bay, giường phụ..."></textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.8rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-glass);">
          <button type="button" class="btn-action" style="padding: 0.6rem 1.2rem;" onclick="closeBookingModal()">Hủy</button>
          <button type="submit" class="btn-gold">Xác Nhận Đặt Phòng</button>
        </div>
      </form>
    </div>
  </div>
@endsection

@section('scripts')
<script>
  function openBookingModal() {
    document.getElementById('bookingModal').classList.add('open');
  }
  function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('open');
  }
</script>
@endsection
