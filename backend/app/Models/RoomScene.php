<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoomScene extends Model
{
    protected $guarded = [];

    protected $casts = [
        'initial_target' => 'array',
        'is_main' => 'boolean',
        'order' => 'integer',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function hotspots(): HasMany
    {
        return $this->hasMany(Hotspot::class, 'scene_id')->orderBy('order');
    }
}
