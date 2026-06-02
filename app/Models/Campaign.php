<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Campaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'spend',
        'revenue',
        'conversions',
        'platform_id',
    ];

    protected function casts(): array
    {
        return [
            'spend' => 'float',
            'revenue' => 'float',
            'conversions' => 'integer',
        ];
    }

    public function platform(): BelongsTo
    {
        return $this->belongsTo(Platform::class);
    }
}
