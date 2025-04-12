<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatementTemplate extends Model
{
    use HasFactory;

    protected $fillable = ['title','content'];


    public function statements()
    {
        return $this->hasMany(Statement::class);
    }
}
