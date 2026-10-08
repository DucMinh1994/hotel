<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\Room;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $room301 = Room::where('room_number', '301')->first();
        $room502 = Room::where('room_number', '502')->first();

        if ($room301) {
            Booking::firstOrCreate(
                ['booking_code' => 'BK-88301'],
                [
                    'room_id' => $room301->id,
                    'customer_name' => 'Nguyễn Văn An',
                    'customer_phone' => '0901234567',
                    'customer_email' => 'an.nguyen@gmail.com',
                    'check_in_date' => now()->addDays(2)->format('Y-m-d'),
                    'check_out_date' => now()->addDays(4)->format('Y-m-d'),
                    'nights' => 2,
                    'guests_count' => 2,
                    'total_price' => 5000000,
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'special_requests' => 'Yêu cầu phòng tầng cao view ngắm trọn hoàng hôn biển, hoa tươi kỷ niệm ngày cưới.',
                ]
            );

            Booking::firstOrCreate(
                ['booking_code' => 'BK-88302'],
                [
                    'room_id' => $room301->id,
                    'customer_name' => 'Lê Hoàng Long',
                    'customer_phone' => '0912334455',
                    'customer_email' => 'long.le@outlook.com',
                    'check_in_date' => now()->addDays(5)->format('Y-m-d'),
                    'check_out_date' => now()->addDays(6)->format('Y-m-d'),
                    'nights' => 1,
                    'guests_count' => 2,
                    'total_price' => 2500000,
                    'status' => 'pending',
                    'payment_status' => 'unpaid',
                    'special_requests' => 'Nhận phòng sớm lúc 12h trưa nếu phòng đã sẵn sàng.',
                ]
            );
        }

        if ($room502) {
            Booking::firstOrCreate(
                ['booking_code' => 'BK-88502'],
                [
                    'room_id' => $room502->id,
                    'customer_name' => 'Trần Thị Bích Ngọc',
                    'customer_phone' => '0988776655',
                    'customer_email' => 'bichngoc.tran@vietnamgroup.vn',
                    'check_in_date' => now()->addDays(7)->format('Y-m-d'),
                    'check_out_date' => now()->addDays(10)->format('Y-m-d'),
                    'nights' => 3,
                    'guests_count' => 3,
                    'total_price' => 17400000,
                    'status' => 'confirmed',
                    'payment_status' => 'paid',
                    'special_requests' => 'Đón tại sân bay bằng xe Maybach, chuẩn bị rượu vang đỏ Pháp và trái cây hữu cơ.',
                ]
            );
        }
    }
}
