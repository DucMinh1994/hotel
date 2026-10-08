<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoomScene;
use App\Models\Hotspot;
use Illuminate\Http\Request;

class HotspotController extends Controller
{
    public function store(Request $request, $sceneId)
    {
        $scene = RoomScene::findOrFail($sceneId);
        $request->validate([
            'item_key' => 'required|string',
            'name' => 'required|string',
            'position_x' => 'required|numeric',
            'position_y' => 'required|numeric',
            'position_z' => 'required|numeric',
        ]);

        $hotspot = $scene->hotspots()->create([
            'item_key' => $request->input('item_key'),
            'name' => $request->input('name'),
            'short_name' => $request->input('short_name', $request->input('name')),
            'category' => $request->input('category', 'Nội Thất & Tiện Nghi'),
            'icon' => $request->input('icon', '📍'),
            'type' => $request->input('type', 'item'), // 'item', 'portal', 'back_portal'
            'target_room_key' => $request->input('target_room_key'),
            'image_url' => $request->input('image_url'),
            'position_x' => (float)$request->input('position_x'),
            'position_y' => (float)$request->input('position_y'),
            'position_z' => (float)$request->input('position_z'),
            'description' => $request->input('description'),
            'specs' => $request->input('specs', []),
            'order' => (int)$request->input('order', 0),
        ]);

        return response()->json($hotspot, 201);
    }

    public function update(Request $request, $id)
    {
        $hotspot = Hotspot::findOrFail($id);
        $hotspot->update($request->all());
        return response()->json($hotspot);
    }

    public function destroy($id)
    {
        $hotspot = Hotspot::findOrFail($id);
        $hotspot->delete();
        return response()->json(['message' => 'Xóa điểm ghim thành công']);
    }
}
