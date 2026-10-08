<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;

// Trang chủ backend dẫn vào Dashboard Quản lý đặt phòng
Route::get('/', [BookingController::class, 'index'])->name('dashboard');

// Quản lý Đặt Phòng (Bookings)
Route::prefix('bookings')->group(function () {
    Route::get('/', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/', [BookingController::class, 'store'])->name('bookings.store');
    Route::put('/{id}/status', [BookingController::class, 'updateStatus'])->name('bookings.status');
    Route::delete('/{id}', [BookingController::class, 'destroy'])->name('bookings.destroy');
});

// Xem Chi Tiết Phòng Kiểu 360° Panorama
Route::get('/room-360/{roomId?}', [BookingController::class, 'show360'])->name('room.360');
