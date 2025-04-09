<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'from',
        'to',
        'content',
        'template_id'
    ];

    public function template()
    {
        return $this->belongsTo(StatementTemplate::class, 'template_id');
    }
}
