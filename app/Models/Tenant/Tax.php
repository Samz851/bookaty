<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'rate',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'total',
    ];

    public function transactions()
    {
        return $this->hasMany(TransTax::class, 'tax_id');
    }

    public function getTotalAttribute()
    {
        return $this->transactions->sum('amount');
    }

    public function account()
    {
        return $this->belongsTo(Account::class, 'account_id');
    }
}
