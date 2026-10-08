<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotspots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scene_id')->constrained('room_scenes')->onDelete('cascade');
            $table->string('item_key'); // 'bath', 'bed', 'window', 'sea_view', etc.
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->string('category')->nullable();
            $table->string('icon')->default('📍');
            $table->string('type')->default('item'); // 'item', 'portal', 'back_portal'
            $table->string('target_room_key')->nullable(); // 'bathroom', 'balcony' when type is portal
            $table->string('image_url')->nullable();
            $table->double('position_x', 8, 3)->default(0);
            $table->double('position_y', 8, 3)->default(0);
            $table->double('position_z', 8, 3)->default(0);
            $table->text('description')->nullable();
            $table->json('specs')->nullable(); // array of {key, val}
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotspots');
    }
};
