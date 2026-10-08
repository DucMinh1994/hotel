<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('room_number')->unique();
            $table->string('name');
            $table->string('short_name')->nullable();
            $table->text('tagline')->nullable();
            $table->unsignedBigInteger('price')->default(0);
            $table->string('price_formatted')->nullable();
            $table->string('area')->nullable();
            $table->string('capacity')->nullable();
            $table->string('bed_type')->nullable();
            $table->string('view_type')->nullable();
            $table->string('badge')->nullable();
            $table->string('room_image')->nullable();
            $table->string('panorama_360_url')->nullable();
            $table->string('panorama_fallback_url')->nullable();
            $table->json('theme')->nullable();
            $table->json('amenities')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
