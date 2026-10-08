<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('room_scenes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->string('scene_key'); // 'main', 'bathroom', 'balcony'
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->text('tagline')->nullable();
            $table->string('panorama_360_url');
            $table->string('panorama_fallback_url')->nullable();
            $table->json('initial_target')->nullable(); // {x, y, z}
            $table->boolean('is_main')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('room_scenes');
    }
};
