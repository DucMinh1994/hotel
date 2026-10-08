<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\RoomScene;
use App\Models\Hotspot;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        // ================= ROOM 301 =================
        $room301 = Room::updateOrCreate(
            ['room_number' => '301'],
            [
                'name' => 'Phòng 301 - Deluxe Grand Ocean Suite',
                'short_name' => 'Deluxe Ocean Suite',
                'tagline' => 'Tầm nhìn hoàng hôn vịnh biển vô cực & Nội thất gỗ óc chó ấm cúng',
                'price' => 2850000,
                'price_formatted' => '2.850.000₫',
                'area' => '48 m²',
                'capacity' => '2 Người lớn + 1 Trẻ em',
                'bed_type' => '1 Giường King-Size (2m x 2m2)',
                'view_type' => 'Hướng biển Panorama 180°',
                'badge' => 'Phòng Bán Chạy Nhất',
                'room_image' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'panorama_360_url' => 'hotel_room_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/hotel_room.jpg',
                'theme' => [
                    'wallColor' => '#23201d',
                    'woodTone' => 'walnut',
                    'accentColor' => '#d4af37',
                    'rugPattern' => 'deluxe',
                    'isNightDefault' => false,
                ],
                'amenities' => [
                    ['icon' => '🌊', 'label' => 'View biển trực diện'],
                    ['icon' => '🛏️', 'label' => 'Giường King nệm cao su non'],
                    ['icon' => '🛁', 'label' => 'Phòng tắm En-suite sang trọng'],
                    ['icon' => '📺', 'label' => 'Smart TV 65" 4K'],
                    ['icon' => '💼', 'label' => 'Bàn làm việc doanh nhân'],
                    ['icon' => '🍸', 'label' => 'Mini Bar & Khay cà phê'],
                    ['icon' => '📶', 'label' => 'Wi-Fi 6 siêu tốc'],
                    ['icon' => '🍽️', 'label' => 'Ăn sáng Buffet 5 sao'],
                ],
                'is_active' => true,
            ]
        );

        // 1. Scene Chính: Phòng Ngủ Suite 301
        $sceneMain301 = RoomScene::updateOrCreate(
            ['room_id' => $room301->id, 'scene_key' => 'main'],
            [
                'name' => 'Phòng Ngủ Master Suite 301',
                'short_name' => 'Phòng Ngủ',
                'tagline' => 'Không gian nghỉ ngơi thư thái giường King-size view biển',
                'panorama_360_url' => 'hotel_room_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/hotel_room.jpg',
                'initial_target' => ['x' => 0, 'y' => 0, 'z' => -1],
                'is_main' => true,
                'order' => 1,
            ]
        );

        // Hotspots Phòng Ngủ 301
        $hotspotsMain301 = [
            [
                'item_key' => 'bath',
                'name' => 'Cửa Phòng Tắm Kính Mờ & En-suite Master',
                'short_name' => 'Phòng Tắm',
                'category' => 'Phòng Tắm & Spa',
                'icon' => '🛁',
                'type' => 'portal',
                'target_room_key' => 'bathroom',
                'image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 2.92, 'position_y' => -0.05, 'position_z' => -0.67,
                'description' => 'Cửa kính cường lực mờ cao cấp với tay nắm gạt sang trọng, mở lối vào phòng tắm master en-suite bọc đá cẩm thạch trắng Carrara với bồn tắm thư giãn.',
                'specs' => [
                    ['key' => 'Cửa phòng tắm', 'val' => 'Kính cường lực mờ chống nước viền hợp kim nhôm xám'],
                    ['key' => 'Trang thiết bị', 'val' => 'Bồn tắm nằm thư giãn & Vòi sen tắm đứng Grohe Đức'],
                    ['key' => 'Tương tác 3D', 'val' => 'Nhấp vào để mở cửa bước vào khám phá bên trong phòng tắm!'],
                ],
                'order' => 1,
            ],
            [
                'item_key' => 'bed',
                'name' => 'Giường Ngủ Hoàng Gia King-Size',
                'short_name' => 'Giường King',
                'category' => 'Nội Thất Phòng Ngủ',
                'icon' => '🛏️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 0.85, 'position_y' => -1.11, 'position_z' => -2.65,
                'description' => 'Giường cỡ King chuẩn 5 sao kích thước 2.0m x 2.2m. Nệm lò xo túi Dunlopillo nâng đỡ 7 vùng cột sống, drap lụa sợi Tencel 1000TC êm ái.',
                'specs' => [
                    ['key' => 'Kích thước', 'val' => '200cm x 220cm x 65cm (Cỡ King chuẩn quốc tế)'],
                    ['key' => 'Chất liệu nệm', 'val' => 'Lò xo túi độc lập & Cao su non Dunlopillo Anh Quốc'],
                ],
                'order' => 2,
            ],
            [
                'item_key' => 'tv',
                'name' => 'Smart TV 65" 4K Treo Tường',
                'short_name' => 'Smart TV',
                'category' => 'Thiết Bị Điện Tử',
                'icon' => '📺',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -1.27, 'position_y' => 0.22, 'position_z' => 2.71,
                'description' => 'Smart TV 65 inch độ phân giải 4K sắc nét gắn tường, tích hợp Netflix, YouTube, Apple AirPlay 2.',
                'specs' => [
                    ['key' => 'Kích thước màn hình', 'val' => '65 inch 4K Ultra HD HDR tấm nền cao cấp'],
                    ['key' => 'Kết nối', 'val' => 'AirPlay 2, Chromecast, Bluetooth 5.2, Wi-Fi 6'],
                ],
                'order' => 3,
            ],
            [
                'item_key' => 'desk',
                'name' => 'Bàn Làm Việc Doanh Nhân & Ghế Xoay Da',
                'short_name' => 'Bàn Làm Việc',
                'category' => 'Góc Làm Việc',
                'icon' => '💼',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -0.19, 'position_y' => -1.73, 'position_z' => 2.44,
                'description' => 'Khu vực bàn làm việc uốn lượn phong cách hiện đại với ghế xoay công thái học bọc da cao cấp chân sao kim loại mạ chrome.',
                'specs' => [
                    ['key' => 'Mặt bàn', 'val' => 'Gỗ sồi đen uốn cong phủ sơn mờ chống trầy xước'],
                ],
                'order' => 4,
            ],
            [
                'item_key' => 'minibar',
                'name' => 'Quầy Mini Bar & Khay Trà Cà Phê',
                'short_name' => 'Mini Bar',
                'category' => 'Tiện Ích Ẩm Thực',
                'icon' => '☕',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.12, 'position_y' => -1, 'position_z' => 1.88,
                'description' => 'Tủ lạnh minibar siêu êm 0dB tích hợp kín đáo dưới góc bàn làm việc, kèm ấm siêu tốc và trà cà phê miễn phí.',
                'specs' => [
                    ['key' => 'Tủ mát minibar', 'val' => 'Tủ lạnh mini công nghệ hấp thụ nhiệt 0dB không tiếng ồn'],
                ],
                'order' => 5,
            ],
            [
                'item_key' => 'armchair',
                'name' => 'Ghế Bành Thư Giãn Màu Vàng Cốm',
                'short_name' => 'Ghế Thư Giãn',
                'category' => 'Nội Thất Thư Giãn',
                'icon' => '🛋️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.47, 'position_y' => -1.64, 'position_z' => 0.47,
                'description' => 'Ghế bành đơn bọc nỉ màu vàng cốm thời thượng tựa lưng cao êm ái đặt sát khung cửa sổ.',
                'specs' => [
                    ['key' => 'Chất liệu nỉ', 'val' => 'Vải nỉ cao cấp dệt sợi tự nhiên chống bám bẩn'],
                ],
                'order' => 6,
            ],
            [
                'item_key' => 'window',
                'name' => 'Cửa Trượt Kính Ban Công Panorama View Biển',
                'short_name' => 'Ban Công View Biển',
                'category' => 'Ban Công & Tầm Nhìn',
                'icon' => '🌊',
                'type' => 'portal',
                'target_room_key' => 'balcony',
                'image_url' => 'balcony_preview.jpg',
                'position_x' => -2.07, 'position_y' => 0.22, 'position_z' => -2.16,
                'description' => 'Cửa trượt kính cường lực kịch trần mở lối bước ra ban công riêng view biển. Nơi bạn đứng ngắm trọn vẹn vịnh biển xanh ngắt bao la và đại lộ sầm uất phía dưới.',
                'specs' => [
                    ['key' => 'Cửa ban công', 'val' => 'Cửa kính hộp Low-E 3 lớp trượt êm ái cách âm tuyệt đối'],
                    ['key' => 'Tầm nhìn ban công', 'val' => 'Trực diện biển xanh bao la & Đại lộ ven biển phía dưới'],
                    ['key' => 'Trải nghiệm 3D', 'val' => 'Nhấp vào để mở cửa trượt kính bước ra ban công ngắm cảnh!'],
                ],
                'order' => 7,
            ],
            [
                'item_key' => 'door',
                'name' => 'Cửa Chính Ra Vào & Sảnh Phòng',
                'short_name' => 'Cửa Ra Vào',
                'category' => 'Kiến Trúc & An Ninh',
                'icon' => '🚪',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 2.08, 'position_y' => -0.12, 'position_z' => 2.16,
                'description' => 'Lối vào phòng suite với cửa gỗ chống cháy cách âm, khóa thẻ từ RFID thông minh.',
                'specs' => [
                    ['key' => 'Hệ thống khóa', 'val' => 'Khóa thẻ từ RFID công nghệ mã hóa bảo mật cao'],
                ],
                'order' => 8,
            ],
        ];

        foreach ($hotspotsMain301 as $h) {
            Hotspot::updateOrCreate(
                ['scene_id' => $sceneMain301->id, 'item_key' => $h['item_key']],
                $h
            );
        }

        // 2. Scene Phòng Tắm 301
        $sceneBath301 = RoomScene::updateOrCreate(
            ['room_id' => $room301->id, 'scene_key' => 'bathroom'],
            [
                'name' => 'Phòng 301 - Phòng Tắm Master En-suite',
                'short_name' => 'Phòng Tắm Master',
                'tagline' => 'Không gian Spa & Thư giãn riêng tư bọc đá cẩm thạch trắng Carrara',
                'panorama_360_url' => 'bathroom_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/bathroom.jpg',
                'initial_target' => ['x' => -2.57, 'y' => -1.54, 'z' => -0.11],
                'is_main' => false,
                'order' => 2,
            ]
        );

        $hotspotsBath301 = [
            [
                'item_key' => 'bathtub',
                'name' => 'Bồn Tắm Nằm Thư Giãn Bục Đá',
                'short_name' => 'Bồn Tắm Nằm',
                'category' => 'Thiết Bị Thư Giãn',
                'icon' => '🛁',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.57, 'position_y' => -1.54, 'position_z' => -0.11,
                'description' => 'Bồn tắm nằm âm sàn đặt trên bục đá cẩm thạch kiêu sa với thành bồn uốn cong công thái học nâng đỡ cơ thể.',
                'specs' => [['key' => 'Kích thước', 'val' => '175cm x 85cm x 60cm sâu rộng thoải mái']],
                'order' => 1,
            ],
            [
                'item_key' => 'shower',
                'name' => 'Cabin Tắm Kính Đứng & Sen Cây Tăng Áp',
                'short_name' => 'Cabin Tắm Kính',
                'category' => 'Khu Vực Tắm Đứng',
                'icon' => '🚿',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 2.89, 'position_y' => -0.12, 'position_z' => 0.80,
                'description' => 'Buồng tắm đứng vách kính cường lực trong suốt chống tràn nước, sen cây Grohe Rainshower đường kính lớn 310mm.',
                'specs' => [['key' => 'Vách kính', 'val' => 'Kính cường lực 10mm phủ Nano chống bám cặn nước']],
                'order' => 2,
            ],
            [
                'item_key' => 'vanity',
                'name' => 'Bàn Lavabo Đá Cẩm Thạch & Chậu Rửa Mặt',
                'short_name' => 'Bàn Lavabo',
                'category' => 'Bàn Trang Điểm & Vệ Sinh',
                'icon' => '🪞',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 0.10, 'position_y' => -1.23, 'position_z' => 2.73,
                'description' => 'Bàn trang điểm và rửa mặt mặt đá cẩm thạch trắng tự nhiên với chậu rửa âm bàn sứ Toto CeFiONtect.',
                'specs' => [['key' => 'Mặt bàn đá', 'val' => 'Đá cẩm thạch Marble Carrara trắng vân mây tự nhiên']],
                'order' => 3,
            ],
            [
                'item_key' => 'toiletries',
                'name' => 'Bộ Mỹ Phẩm & Khay Tiện Nghi 5 Sao',
                'short_name' => 'Mỹ Phẩm Tiện Nghi',
                'category' => 'Tiện Nghi Vệ Sinh',
                'icon' => '🧴',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 1.00, 'position_y' => -0.46, 'position_z' => 2.79,
                'description' => 'Bộ tiện ích cá nhân chuẩn 5 sao bao gồm dầu gội, sữa tắm L\'Occitane hữu cơ, bàn chải tre thân thiện môi trường.',
                'specs' => [['key' => 'Bộ mỹ phẩm', 'val' => 'L\'Occitane chiết xuất thảo mộc cao cấp']],
                'order' => 4,
            ],
            [
                'item_key' => 'towels',
                'name' => 'Giá Treo Khăn Đôi & Khăn Tắm Cotton',
                'short_name' => 'Khăn Tắm Cao Cấp',
                'category' => 'Đồ Vải Khách Sạn',
                'icon' => '🧣',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 2.43, 'position_y' => -0.46, 'position_z' => -1.69,
                'description' => 'Giá treo khăn mạ chrome kép trang bị sẵn khăn tắm lớn 100% cotton Ai Cập 800 GSM siêu dày mềm.',
                'specs' => [['key' => 'Chất liệu khăn', 'val' => '100% Cotton Ai Cập 800 GSM']],
                'order' => 5,
            ],
            [
                'item_key' => 'back_to_bedroom',
                'name' => 'Cửa Quay Lại Phòng Ngủ Suite 301',
                'short_name' => 'Về Phòng Ngủ',
                'category' => 'Điều Hướng Không Gian',
                'icon' => '🚪',
                'type' => 'back_portal',
                'target_room_key' => 'main',
                'image_url' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -0.10, 'position_y' => -0.12, 'position_z' => -3.00,
                'description' => 'Cánh cửa mở lối quay trở lại phòng ngủ Deluxe Grand Ocean Suite 301.',
                'specs' => [['key' => 'Điểm đến', 'val' => 'Phòng ngủ Master Suite 301']],
                'order' => 6,
            ],
        ];

        foreach ($hotspotsBath301 as $h) {
            Hotspot::updateOrCreate(
                ['scene_id' => $sceneBath301->id, 'item_key' => $h['item_key']],
                $h
            );
        }

        // 3. Scene Ban Công 301
        $sceneBalcony301 = RoomScene::updateOrCreate(
            ['room_id' => $room301->id, 'scene_key' => 'balcony'],
            [
                'name' => 'Ban Công Panorama View Biển',
                'short_name' => 'Ban Công View Biển',
                'tagline' => 'Ban công ngắm trọn vẹn vịnh biển xanh ngọc bích & đại lộ ven biển phía dưới',
                'panorama_360_url' => 'balcony_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/fish_hoek_beach.jpg',
                'initial_target' => ['x' => 0.2, 'y' => 0.15, 'z' => -2.95],
                'is_main' => false,
                'order' => 3,
            ]
        );

        $hotspotsBalcony301 = [
            [
                'item_key' => 'sea_view',
                'name' => 'Tầm Nhìn Vịnh Biển Vô Cực',
                'short_name' => 'View Biển Xanh',
                'category' => 'Cảnh Quan Ngoại Cảnh',
                'icon' => '🌊',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 0.2, 'position_y' => 0.15, 'position_z' => -2.95,
                'description' => 'Tầm nhìn không giới hạn hướng ra vịnh biển xanh ngọc bích, bờ cát trắng trải dài và những con sóng êm đềm.',
                'specs' => [
                    ['key' => 'Hướng nhìn', 'val' => 'Chính diện biển (Direct Ocean View)'],
                    ['key' => 'Không khí', 'val' => 'Gió biển tự nhiên thoáng đãng trong lành'],
                ],
                'order' => 1,
            ],
            [
                'item_key' => 'street_view',
                'name' => 'Đại Lộ Ven Biển & Tuyến Phố Đi Bộ',
                'short_name' => 'Đường Phố Phía Dưới',
                'category' => 'Cảnh Quan Ngoại Cảnh',
                'icon' => '🛣️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 1.7, 'position_y' => -1.7, 'position_z' => -1.7,
                'description' => 'Góc nhìn từ ban công nhìn thẳng xuống đại lộ ven biển rợp bóng dừa, làn đường xe chạy êm đềm và vỉa hè lát đá hoa cương.',
                'specs' => [
                    ['key' => 'Góc nhìn', 'val' => 'Từ ban công tầng cao nhìn xuống đại lộ dưới chân tòa nhà'],
                    ['key' => 'Hạ tầng', 'val' => 'Đường ven biển 4 làn xe, vỉa hè lát đá và hàng dừa mát rượi'],
                ],
                'order' => 2,
            ],
            [
                'item_key' => 'balcony_table',
                'name' => 'Bàn Trà & Ghế Mây Thư Giãn Ngoài Trời',
                'short_name' => 'Bàn Ghế Ban Công',
                'category' => 'Tiện Nghi Ban Công',
                'icon' => '☕',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.2, 'position_y' => -1.5, 'position_z' => -0.9,
                'description' => 'Bộ bàn trà tròn mặt kính cường lực kèm 2 ghế tựa mây nhựa đan thủ công kháng tia UV và chống chịu thời tiết biển.',
                'specs' => [
                    ['key' => 'Chất liệu', 'val' => 'Mây nhựa cao cấp kháng nước biển & Hợp kim nhôm sơn tĩnh điện'],
                ],
                'order' => 3,
            ],
            [
                'item_key' => 'glass_railing',
                'name' => 'Lan Can Kính Cường Lực Không Viền',
                'short_name' => 'Lan Can Kính 1.2m',
                'category' => 'An Toàn & Kiến Trúc',
                'icon' => '🛡️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -0.2, 'position_y' => -1.2, 'position_z' => -2.7,
                'description' => 'Hệ lan can kính cường lực an toàn dày 15mm cao 1.2m với tay vịn inox 316 chống ăn mòn muối biển.',
                'specs' => [
                    ['key' => 'Chiều cao lan can', 'val' => '1.2m đạt tiêu chuẩn an toàn nghỉ dưỡng 5 sao quốc tế'],
                ],
                'order' => 4,
            ],
            [
                'item_key' => 'back_to_bedroom_from_balcony',
                'name' => 'Cửa Trượt Quay Lại Phòng Ngủ Suite 301',
                'short_name' => 'Vào Lại Phòng Ngủ',
                'category' => 'Điều Hướng Không Gian',
                'icon' => '🚪',
                'type' => 'back_portal',
                'target_room_key' => 'main',
                'image_url' => 'hotel_room_preview.jpg',
                'position_x' => 0.1, 'position_y' => 0.0, 'position_z' => 2.95,
                'description' => 'Cửa kính trượt cách âm 3 lớp dẫn ngược trở lại không gian phòng ngủ Deluxe Grand Ocean Suite ấm cúng.',
                'specs' => [
                    ['key' => 'Điểm đến', 'val' => 'Phòng ngủ Master Suite 301'],
                ],
                'order' => 5,
            ],
        ];

        foreach ($hotspotsBalcony301 as $h) {
            Hotspot::updateOrCreate(
                ['scene_id' => $sceneBalcony301->id, 'item_key' => $h['item_key']],
                $h
            );
        }

        // ================= ROOM 502 =================
        $room502 = Room::updateOrCreate(
            ['room_number' => '502'],
            [
                'name' => 'Phòng 502 - Royal Presidential Sky Suite',
                'short_name' => 'Presidential Sky Suite',
                'tagline' => 'Đỉnh cao xa hoa tầng 50 với phòng khách Lounge phong cách Hoàng Gia cổ điển',
                'price' => 5900000,
                'price_formatted' => '5.900.000₫',
                'area' => '92 m²',
                'capacity' => '3 Người lớn hoặc 2 Người lớn + 2 Trẻ em',
                'bed_type' => 'Phòng khách Suite hoàng gia + Phòng ngủ Master Super King',
                'view_type' => 'Skyline Thành Phố Đêm Tầng 50',
                'badge' => 'Hạng Phòng Tổng Thống Đẳng Cấp',
                'room_image' => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
                'panorama_360_url' => 'anniversary_lounge_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/anniversary_lounge.jpg',
                'theme' => [
                    'wallColor' => '#121721',
                    'woodTone' => 'ebony',
                    'accentColor' => '#38bdf8',
                    'rugPattern' => 'presidential',
                    'isNightDefault' => true,
                ],
                'amenities' => [
                    ['icon' => '🏙️', 'label' => 'Tầng 50 view Skyline lộng lẫy'],
                    ['icon' => '🛋️', 'label' => 'Phòng khách Lounge nhung quý tộc'],
                    ['icon' => '✨', 'label' => 'Đèn chùm đồng hoa loa kèn'],
                    ['icon' => '🏺', 'label' => 'Tủ búp-phê gỗ quý cổ điển'],
                    ['icon' => '🪟', 'label' => 'Cửa sổ vòm & Rèm yếm sò'],
                    ['icon' => '🤵', 'label' => 'Quản gia riêng 24/7 (Butler)'],
                    ['icon' => '🚗', 'label' => 'Đưa đón sân bay bằng Maybach'],
                    ['icon' => '🥂', 'label' => 'Tiệc trà chiều High Tea & Rượu vang'],
                ],
                'is_active' => true,
            ]
        );

        $sceneMain502 = RoomScene::updateOrCreate(
            ['room_id' => $room502->id, 'scene_key' => 'main'],
            [
                'name' => 'Phòng Khách Lounge Hoàng Gia Tầng 50',
                'short_name' => 'Phòng Khách Hoàng Gia',
                'tagline' => 'Không gian đại sảnh tiếp khách phong cách Châu Âu cổ điển',
                'panorama_360_url' => 'anniversary_lounge_preview.jpg',
                'panorama_fallback_url' => 'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/anniversary_lounge.jpg',
                'initial_target' => ['x' => 0.4, 'y' => -2.17, 'z' => -2.04],
                'is_main' => true,
                'order' => 1,
            ]
        );

        $hotspotsMain502 = [
            [
                'item_key' => 'armchair',
                'name' => 'Sofa Góc Lounge Velvet & Bàn Trà Kính',
                'short_name' => 'Sofa Lounge',
                'category' => 'Nội Thất Phòng Khách',
                'icon' => '🛋️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 0.4, 'position_y' => -2.17, 'position_z' => -2.04,
                'description' => 'Bộ sofa nhung vương giả góc chữ L màu xanh ngọc lục bảo kết hợp bàn trà mặt kính khung gỗ tự nhiên cao cấp.',
                'specs' => [['key' => 'Chất liệu sofa', 'val' => 'Nhung nỉ cao cấp Dedar Milano phong cách quý tộc']],
                'order' => 1,
            ],
            [
                'item_key' => 'chair',
                'name' => 'Ghế Bành Thư Giãn Vintage Emerald',
                'short_name' => 'Ghế Bành',
                'category' => 'Nội Thất Thư Giãn',
                'icon' => '🪑',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -0.81, 'position_y' => -1.82, 'position_z' => 2.24,
                'description' => 'Ghế bành đơn đệm dày êm ái bọc nhung xanh cổ điển đi kèm bàn trà nhỏ bằng gỗ mộc.',
                'specs' => [['key' => 'Màu sắc', 'val' => 'Xanh ngọc lục bảo (Emerald Green) quý phái']],
                'order' => 2,
            ],
            [
                'item_key' => 'credenza',
                'name' => 'Tủ Credenza Gỗ Quý & Bình Hoa Nghệ Thuật',
                'short_name' => 'Tủ Credenza',
                'category' => 'Nội Thất Cổ Điển',
                'icon' => '🏺',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.53, 'position_y' => -0.58, 'position_z' => 1.5,
                'description' => 'Tủ búp-phê gỗ quý cổ điển với cánh pano chạm khắc tinh xảo, trên mặt tủ bài trí bình hoa nghệ thuật.',
                'specs' => [['key' => 'Chất liệu tủ', 'val' => 'Gỗ gụ nguyên khối xử lý sơn bóng cổ điển']],
                'order' => 3,
            ],
            [
                'item_key' => 'window',
                'name' => 'Cửa Sổ Vòm & Rèm Cổ Điển Hoàng Gia',
                'short_name' => 'Cửa Sổ Vòm',
                'category' => 'Kiến Trúc & Tầm Nhìn',
                'icon' => '🪟',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
                'position_x' => -2.89, 'position_y' => -0.12, 'position_z' => -0.8,
                'description' => 'Hệ thống cửa sổ vòm đón ánh sáng tự nhiên với rèm voan trắng thêu hoa kết hợp rèm yếm sò cổ điển hoa văn gấm.',
                'specs' => [['key' => 'Kiểu dáng cửa', 'val' => 'Cửa sổ vòm phong cách kiến trúc Châu Âu cổ điển']],
                'order' => 4,
            ],
            [
                'item_key' => 'chandelier',
                'name' => 'Đèn Chùm Đồng Pha Lê Tân Cổ Điển',
                'short_name' => 'Đèn Chùm',
                'category' => 'Hệ Thống Ánh Sáng',
                'icon' => '✨',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 1.65, 'position_y' => 2.31, 'position_z' => -0.97,
                'description' => 'Đèn chùm thân đồng đúc nguyên khối với tay đèn uốn lượn mang chao đèn thủy tinh hoa loa kèn.',
                'specs' => [['key' => 'Chất liệu', 'val' => 'Đồng thau đúc mạ vàng cổ kết hợp chao thủy tinh mờ']],
                'order' => 5,
            ],
            [
                'item_key' => 'painting',
                'name' => 'Tranh Sơn Dầu Phong Cảnh Cổ Điển',
                'short_name' => 'Tranh Sơn Dầu',
                'category' => 'Nghệ Thuật & Trang Trí',
                'icon' => '🖼️',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 1.27, 'position_y' => 0.45, 'position_z' => -2.68,
                'description' => 'Bức tranh sơn dầu phong cảnh rừng cây thiên nhiên đóng khung gỗ mạ vàng trang nhã.',
                'specs' => [['key' => 'Thể loại', 'val' => 'Tranh sơn dầu vẽ tay phong cảnh Châu Âu cổ điển']],
                'order' => 6,
            ],
            [
                'item_key' => 'foyer',
                'name' => 'Lối Vào Đại Sảnh & Phòng Ngủ Suite',
                'short_name' => 'Lối Vào Suite',
                'category' => 'Kiến Trúc Suite',
                'icon' => '🚪',
                'type' => 'item',
                'image_url' => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
                'position_x' => 2.98, 'position_y' => -0.12, 'position_z' => -0.33,
                'description' => 'Vòm cửa thông phòng sang trọng kết nối phòng khách lounge với khu vực phòng ngủ Master Super King.',
                'specs' => [['key' => 'Kiến trúc', 'val' => 'Vòm cửa gỗ uốn cong kết nối liên hoàn các gian phòng']],
                'order' => 7,
            ],
        ];

        foreach ($hotspotsMain502 as $h) {
            Hotspot::updateOrCreate(
                ['scene_id' => $sceneMain502->id, 'item_key' => $h['item_key']],
                $h
            );
        }
    }
}
