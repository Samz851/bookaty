<?php

namespace App\Models;

use App\Traits\HasLogo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Options extends Model
{
    use HasFactory, HasLogo;

    protected $fillable = [
        'organization_id',
        'fiscal_cycle',
        'fiscal_year_start',
        'description',
        'option_1',
        'option_2',
        'option_3',
        'option_4',
    ];

    protected static function booted(): void
    {
        // static::creating(function($options) {
        //     $options->code = $options->generateCode();
        // });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
