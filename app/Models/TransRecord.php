<?php

namespace App\Models;

use App\Enums\AccountTransactionTypes;
use App\Models\Account;
use App\Models\Tax;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TransRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'name',
        'description',
        'amount',
        'tax_id',
        'code'
    ];

    protected static function booted(): void
    {
        static::creating(function ($record) {
            $last = self::latest('code')->first();
            if ($last) {
                if (preg_match('/^([A-Za-z]*)(\d+)$/', $last->code, $matches)) {
                    $prefix = $matches[1]; // Extract the prefix
                    $number = $matches[2]; // Extract the numeric part
            
                    // Increment the numeric part and preserve leading zeros
                    $incrementedNumber = str_pad((int)$number + 1, strlen($number), '0', STR_PAD_LEFT);
            
                    // Combine the prefix and the incremented number
                    $record->code = $prefix . $incrementedNumber;
                }
            } else {
                $record->code = "T100";
            }
        });
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function noteable(): MorphTo
    {
        return $this->morphTo();
    }

    public function debitAccounts()
    {
        // return $this->belongsTo(Account::class, 'debit_account_id');
        return $this->belongsToMany(Account::class, 'account_trans_record')
            ->using(AccountTransRecord::class)
            ->withPivot(['type', 'amount'])
            ->wherePivot('type', AccountTransactionTypes::DEBIT);
    }

    public function creditAccounts()
    {
        // return $this->belongsTo(Account::class, 'credit_account_id');
        return $this->belongsToMany(Account::class, 'account_trans_record')
            ->using(AccountTransRecord::class)
            ->withPivot(['type', 'amount'])
            ->wherePivot('type', AccountTransactionTypes::CREDIT);
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'trans_id');
    }

    public function relatedRecord()
    {
        return $this->belongsTo(TransRecord::class, 'trans_id');
    }

    public function tax()
    {
        return $this->belongsTo(Tax::class, 'tax_id');
    }
}
