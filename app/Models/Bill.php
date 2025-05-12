<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Bill extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_number',
        'date',
        'due_date',
        'total_amount',
        'tax_amount',
        'currency',
        'status',
        'payment_terms',
        'notes',
        'description',
        'vendor_id',
        'tax_id',
    ];

    const STATUS_UNPAID = 'unpaid';
    const STATUS_PARTIALLY_PAID = 'partially_paid';
    const STATUS_PAID = 'paid';
    const STATUS_OVERDUE = 'overdue';

    protected $casts = [
        'date' => 'date',
        'due_date' => 'date',
        'total_amount' => 'decimal:2',
        'tax_amount' => 'decimal:2',
    ];

    public function vendor()
    {
        return $this->belongsTo(Company::class, 'vendor_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class);
    }

    public function transactionRecord(): MorphOne
    {
        return $this->morphOne(TransRecord::class, 'noteable');
    }
}
