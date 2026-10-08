<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Dashboard hiển thị danh sách đặt phòng và thống kê
     */
    public function index(Request $request)
    {
        $query = Booking::with('room')->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        $bookings = $query->paginate(15);
        $rooms = Room::where('is_active', true)->get();

        // Thống kê nhanh
        $stats = [
            'total_bookings' => Booking::count(),
            'total_revenue' => Booking::where('status', '!=', 'cancelled')->sum('total_price'),
            'pending_count' => Booking::where('status', 'pending')->count(),
            'confirmed_count' => Booking::where('status', 'confirmed')->count(),
        ];

        if ($request->wantsJson()) {
            return response()->json([
                'stats' => $stats,
                'bookings' => $bookings,
            ]);
        }

        return view('bookings.index', compact('bookings', 'rooms', 'stats'));
    }

    /**
     * Tạo đơn đặt phòng mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'check_in_date' => 'required|date',
            'check_out_date' => 'required|date|after:check_in_date',
            'guests_count' => 'nullable|integer|min:1',
            'special_requests' => 'nullable|string',
        ]);

        $room = Room::findOrFail($validated['room_id']);

        // Tính số đêm
        $checkIn = new \DateTime($validated['check_in_date']);
        $checkOut = new \DateTime($validated['check_out_date']);
        $nights = max(1, $checkIn->diff($checkOut)->days);

        $totalPrice = $room->price * $nights;
        $bookingCode = 'BK-' . strtoupper(Str::random(5));

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'room_id' => $room->id,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'nights' => $nights,
            'guests_count' => $validated['guests_count'] ?? 2,
            'total_price' => $totalPrice,
            'status' => 'confirmed',
            'payment_status' => 'unpaid',
            'special_requests' => $validated['special_requests'] ?? null,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Đặt phòng thành công! Mã đơn: ' . $bookingCode,
                'booking' => $booking->load('room'),
            ], 201);
        }

        return redirect()->route('bookings.index')->with('success', "Đặt phòng thành công! Mã đơn: {$bookingCode}");
    }

    /**
     * Cập nhật trạng thái đơn đặt phòng
     */
    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $status = $request->input('status');

        if (in_array($status, ['pending', 'confirmed', 'completed', 'cancelled'])) {
            $booking->status = $status;
            if ($request->has('payment_status')) {
                $booking->payment_status = $request->input('payment_status');
            }
            $booking->save();
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Đã cập nhật trạng thái đơn đặt phòng!',
                'booking' => $booking,
            ]);
        }

        return back()->with('success', 'Đã cập nhật trạng thái đơn đặt phòng!');
    }

    /**
     * Xóa đơn đặt phòng
     */
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        if (request()->wantsJson() || request()->ajax()) {
            return response()->json(['success' => true, 'message' => 'Đã xóa đơn đặt phòng!']);
        }

        return back()->with('success', 'Đã xóa đơn đặt phòng!');
    }

    /**
     * Xem chi tiết phòng kiểu 360 độ trực quan trên Backend
     */
    public function show360($roomId = null)
    {
        $rooms = Room::with(['scenes.hotspots'])->where('is_active', true)->get();

        if ($roomId) {
            $currentRoom = Room::with(['scenes.hotspots'])
                ->where('id', $roomId)
                ->orWhere('room_number', $roomId)
                ->firstOrFail();
        } else {
            $currentRoom = $rooms->first();
        }

        return view('bookings.room-360', compact('rooms', 'currentRoom'));
    }
}
