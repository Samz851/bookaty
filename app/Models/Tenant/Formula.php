<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formula extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'formula', 'code'];
    
    protected static function booted(): void
    {
        static::creating(function ($formula) {
            $last = self::latest('code')->first();
            if ($last) {
                if (preg_match('/^([A-Za-z]*)(\d+)$/', $last->code, $matches)) {
                    $prefix = $matches[1]; // Extract the prefix
                    $number = $matches[2]; // Extract the numeric part
            
                    // Increment the numeric part and preserve leading zeros
                    $incrementedNumber = str_pad((int)$number + 1, strlen($number), '0', STR_PAD_LEFT);
            
                    // Combine the prefix and the incremented number
                    $formula->code = $prefix . $incrementedNumber;
                }
            } else {
                $formula->code = "F100"; // Starting code for Formula
            }
        });
    }
}
