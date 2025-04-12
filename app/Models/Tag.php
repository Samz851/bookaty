<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use App\Models\Account;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'description'
    ];
// protected $with = ['accounts','branches'];
    public function accounts()
{
    return $this->morphedByMany(Account::class, 'taggable');
}
public function branches()
{
    return $this->morphedByMany(AccountsBranch::class, 'taggable');
}
}
