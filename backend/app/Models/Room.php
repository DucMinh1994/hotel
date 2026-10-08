<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $guarded = [];

    protected $casts = [
        'price' => 'integer',
        'theme' => 'array',
        'amenities' => 'array',
        'is_active' => 'boolean',
    ];

    public function scenes(): HasMany
    {
        return $this->hasMany(RoomScene::class)->orderBy('order');
    }

    public function mainScene()
    {
        return $this->hasOne(RoomScene::class)->where('is_main', true);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class)->latest();
    }
}
