<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\RoomScene;
use Illuminate\Http\Request;

class SceneController extends Controller
{
    public function store(Request $request, $roomId)
    {
        $room = Room::findOrFail($roomId);
        $request->validate([
            'scene_key' => 'required|string',
            'name' => 'required|string',
            'panorama_360_url' => 'required|string',
        ]);

        $scene = $room->scenes()->create([
            'scene_key' => $request->input('scene_key'),
            'name' => $request->input('name'),
            'short_name' => $request->input('short_name', $request->input('name')),
            'tagline' => $request->input('tagline'),
            'panorama_360_url' => $request->input('panorama_360_url'),
            'panorama_fallback_url' => $request->input('panorama_fallback_url'),
            'initial_target' => $request->input('initial_target', ['x' => 0, 'y' => 0, 'z' => -1]),
            'is_main' => (bool)$request->input('is_main', false),
            'order' => (int)$request->input('order', 0),
        ]);

        return response()->json($scene, 201);
    }

    public function update(Request $request, $id)
    {
        $scene = RoomScene::findOrFail($id);
        $scene->update($request->all());
        return response()->json($scene);
    }

    public function destroy($id)
    {
        $scene = RoomScene::findOrFail($id);
        $scene->delete();
        return response()->json(['message' => 'Xóa không gian thành công']);
    }
}
