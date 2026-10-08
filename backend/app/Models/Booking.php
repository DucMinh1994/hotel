<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'room_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'check_in_date',
        'check_out_date',
        'nights',
        'guests_count',
        'total_price',
        'status',
        'payment_status',
        'special_requests',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'total_price' => 'decimal:2',
        'nights' => 'integer',
        'guests_count' => 'integer',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class);
    }
}
