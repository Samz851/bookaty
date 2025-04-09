<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransTax extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'trans_id',
        'tax_id',
    ];

    public function transRecord()
    {
        return $this->belongsTo(TransRecord::class, 'trans_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}
