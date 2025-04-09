<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'currency',
        'address',
        'contact_information',
    ];

    // public function accounts()
    // {
    //     return $this->hasMany(Account::class);
    // }

    public function contacts()
    {
        return $this->hasMany(Contact::class, 'company_id');
    }

    // public function invoices()
    // {
    //     return $this->hasMany(Invoice::class);
    // }

    // public function bills()
    // {
    //     return $this->hasMany(Bill::class);
    // }
}
