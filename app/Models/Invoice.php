<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'issue_date',
        'due_date',
        'total_amount',
        'customer_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Contact::class, 'customer_id');
    }

    public function transactionRecord(): MorphOne
    {
        return $this->morphOne(TransRecord::class, 'noteable');
    }
}
