<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Hotspot extends Model
{
    protected $guarded = [];

    protected $casts = [
        'position_x' => 'float',
        'position_y' => 'float',
        'position_z' => 'float',
        'specs' => 'array',
        'order' => 'integer',
    ];

    public function scene(): BelongsTo
    {
        return $this->belongsTo(RoomScene::class, 'scene_id');
    }
}
