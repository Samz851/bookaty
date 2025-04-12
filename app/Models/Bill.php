<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'total_amount',
        'vendor_id',
    ];

    public function vendor()
    {
        return $this->belongsTo(Contact::class, 'vendor_id');
    }

    public function transactionRecord(): MorphOne
    {
        return $this->morphOne(TransRecord::class, 'noteable');
    }
}
