<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AccountBalance extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'code',
        'debit_total',
        'credit_total',
    ];

    protected $appends = ['balance'];
}
