<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:20480', // Hỗ trợ ảnh 360 lên tới 20MB
        ]);

        $file = $request->file('image');
        $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
        
        // Lưu vào public/uploads
        $destinationPath = public_path('uploads');
        if (!file_exists($destinationPath)) {
            mkdir($destinationPath, 0755, true);
        }
        $file->move($destinationPath, $fileName);

        $url = url('uploads/' . $fileName);

        return response()->json([
            'message' => 'Upload ảnh thành công',
            'filename' => $fileName,
            'url' => $url,
        ]);
    }
}
