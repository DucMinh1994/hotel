<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::with(['scenes.hotspots'])->orderBy('id')->get();
        return response()->json($rooms);
    }

    public function show($idOrNumber)
    {
        $room = Room::with(['scenes.hotspots'])
            ->where('id', $idOrNumber)
            ->orWhere('room_number', $idOrNumber)
            ->first();

        if (!$room) {
            return response()->json(['message' => 'Room not found'], 404);
        }

        // Định dạng khớp 100% với cấu trúc ThreeRoomViewer
        $mainScene = $room->scenes->firstWhere('is_main', true) ?: $room->scenes->first();

        $items = [];
        if ($mainScene) {
            foreach ($mainScene->hotspots as $h) {
                $items[] = [
                    'id' => $h->item_key,
                    'name' => $h->name,
                    'shortName' => $h->short_name ?: $h->name,
                    'category' => $h->category,
                    'icon' => $h->icon,
                    'isPortal' => $h->type === 'portal',
                    'isBackPortal' => $h->type === 'back_portal',
                    'targetRoom' => $h->target_room_key,
                    'image' => $h->image_url,
                    'position' => [
                        'x' => (float)$h->position_x,
                        'y' => (float)$h->position_y,
                        'z' => (float)$h->position_z,
                    ],
                    'description' => $h->description,
                    'specs' => $h->specs ?: [],
                ];
            }
        }

        $subRooms = [];
        foreach ($room->scenes->where('is_main', false) as $sub) {
            $subItems = [];
            foreach ($sub->hotspots as $sh) {
                $subItems[] = [
                    'id' => $sh->item_key,
                    'name' => $sh->name,
                    'shortName' => $sh->short_name ?: $sh->name,
                    'category' => $sh->category,
                    'icon' => $sh->icon,
                    'isPortal' => $sh->type === 'portal',
                    'isBackPortal' => $sh->type === 'back_portal',
                    'targetRoom' => $sh->target_room_key,
                    'image' => $sh->image_url,
                    'position' => [
                        'x' => (float)$sh->position_x,
                        'y' => (float)$sh->position_y,
                        'z' => (float)$sh->position_z,
                    ],
                    'description' => $sh->description,
                    'specs' => $sh->specs ?: [],
                ];
            }

            $subRooms[$sub->scene_key] = [
                'id' => $sub->scene_key === 'bathroom' ? "{$room->room_number}_bathroom" : $sub->scene_key,
                'name' => $sub->name,
                'shortName' => $sub->short_name ?: $sub->name,
                'tagline' => $sub->tagline,
                'panorama360Url' => $sub->panorama_360_url,
                'panorama360FallbackUrl' => $sub->panorama_fallback_url,
                'initialTarget' => $sub->initial_target ?: ['x' => 0, 'y' => 0, 'z' => -1],
                'items' => $subItems,
            ];
        }

        return response()->json([
            'id' => (string)$room->room_number,
            'name' => $room->name,
            'shortName' => $room->short_name ?: $room->name,
            'roomNumber' => (string)$room->room_number,
            'tagline' => $room->tagline,
            'price' => (int)$room->price,
            'priceFormatted' => $room->price_formatted ?: number_format($room->price, 0, ',', '.') . '₫',
            'area' => $room->area,
            'capacity' => $room->capacity,
            'bedType' => $room->bed_type,
            'viewType' => $room->view_type,
            'badge' => $room->badge,
            'roomImage' => $room->room_image,
            'panorama360Url' => $mainScene ? $mainScene->panorama_360_url : $room->panorama_360_url,
            'panorama360FallbackUrl' => $mainScene ? $mainScene->panorama_fallback_url : $room->panorama_fallback_url,
            'theme' => $room->theme ?: [
                'wallColor' => '#23201d',
                'woodTone' => 'walnut',
                'accentColor' => '#d4af37',
                'rugPattern' => 'deluxe',
                'isNightDefault' => false,
            ],
            'amenities' => $room->amenities ?: [],
            'items' => $items,
            'subRooms' => $subRooms,
            'raw_model' => $room,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'room_number' => 'required|string|unique:rooms,room_number',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
        ]);

        $price = (int)$request->input('price', 0);
        $room = Room::create([
            'room_number' => $request->input('room_number'),
            'name' => $request->input('name'),
            'short_name' => $request->input('short_name', $request->input('name')),
            'tagline' => $request->input('tagline', ''),
            'price' => $price,
            'price_formatted' => number_format($price, 0, ',', '.') . '₫',
            'area' => $request->input('area', '45 m²'),
            'capacity' => $request->input('capacity', '2 Người lớn'),
            'bed_type' => $request->input('bed_type', '1 Giường King'),
            'view_type' => $request->input('view_type', 'Hướng biển'),
            'badge' => $request->input('badge', 'Phòng Tiêu Chuẩn 5 Sao'),
            'room_image' => $request->input('room_image', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'),
            'panorama_360_url' => $request->input('panorama_360_url', 'hotel_room_preview.jpg'),
            'theme' => $request->input('theme', [
                'wallColor' => '#23201d',
                'woodTone' => 'walnut',
                'accentColor' => '#d4af37',
                'rugPattern' => 'deluxe',
                'isNightDefault' => false,
            ]),
            'amenities' => $request->input('amenities', [
                ['icon' => '🌊', 'label' => 'View biển trực diện'],
                ['icon' => '🛏️', 'label' => 'Giường King êm ái'],
                ['icon' => '📶', 'label' => 'Wi-Fi 6 siêu tốc'],
            ]),
            'is_active' => true,
        ]);

        // Tạo Scene chính mặc định
        $room->scenes()->create([
            'scene_key' => 'main',
            'name' => 'Phòng Ngủ Chính',
            'short_name' => 'Phòng Ngủ',
            'panorama_360_url' => $room->panorama_360_url,
            'initial_target' => ['x' => 0, 'y' => 0, 'z' => -1],
            'is_main' => true,
            'order' => 1,
        ]);

        return response()->json($room->load('scenes.hotspots'), 201);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        $data = $request->all();
        if (isset($data['price'])) {
            $data['price_formatted'] = number_format((int)$data['price'], 0, ',', '.') . '₫';
        }
        $room->update($data);
        return response()->json($room->load('scenes.hotspots'));
    }

    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();
        return response()->json(['message' => 'Xóa phòng thành công']);
    }
}
