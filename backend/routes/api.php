<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SceneController;
use App\Http\Controllers\Api\HotspotController;
use App\Http\Controllers\Api\UploadController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ================= HOTEL 3D TOUR RESTFUL API =================
Route::prefix('rooms')->group(function () {
    Route::get('/', [RoomController::class, 'index']);
    Route::post('/', [RoomController::class, 'store']);
    Route::get('/{id}', [RoomController::class, 'show']);
    Route::put('/{id}', [RoomController::class, 'update']);
    Route::delete('/{id}', [RoomController::class, 'destroy']);

    // Quản lý không gian con (Sub-rooms / Scenes)
    Route::post('/{roomId}/scenes', [SceneController::class, 'store']);
});

Route::prefix('scenes')->group(function () {
    Route::put('/{id}', [SceneController::class, 'update']);
    Route::delete('/{id}', [SceneController::class, 'destroy']);

    // Quản lý điểm ghim (Hotspots) trong từng không gian
    Route::post('/{sceneId}/hotspots', [HotspotController::class, 'store']);
});

Route::prefix('hotspots')->group(function () {
    Route::put('/{id}', [HotspotController::class, 'update']);
    Route::delete('/{id}', [HotspotController::class, 'destroy']);
});

// Upload ảnh 360 panorama & ảnh thực tế đồ vật
Route::post('/upload', [UploadController::class, 'upload']);

// Quản lý Đặt phòng (Bookings API)
Route::prefix('bookings')->group(function () {
    Route::get('/', [\App\Http\Controllers\BookingController::class, 'index']);
    Route::post('/', [\App\Http\Controllers\BookingController::class, 'store']);
    Route::put('/{id}/status', [\App\Http\Controllers\BookingController::class, 'updateStatus']);
    Route::delete('/{id}', [\App\Http\Controllers\BookingController::class, 'destroy']);
});
