<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('campaigns', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 20);
            $table->float('spend');
            $table->float('revenue');
            $table->integer('conversions');
            $table->unsignedInteger('platform_id');
            $table->timestamps();

            $table->foreign('platform_id')
                ->references('id')
                ->on('platforms')
                ->onUpdate('cascade')
                ->onDelete('restrict');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE campaigns ADD CONSTRAINT campaigns_name_min_length CHECK (char_length(name) >= 10)');
            DB::statement('ALTER TABLE campaigns ADD CONSTRAINT campaigns_spend_min CHECK (spend >= 0)');
            DB::statement('ALTER TABLE campaigns ADD CONSTRAINT campaigns_revenue_min CHECK (revenue >= 0)');
            DB::statement('ALTER TABLE campaigns ADD CONSTRAINT campaigns_conversions_min CHECK (conversions >= 0)');
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
