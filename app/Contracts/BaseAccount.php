<?php

namespace App\Contracts;

use App\Enums\BaseAccountTaxonomy;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

interface BaseAccount
{
    public function getTaxonomy(): BaseAccountTaxonomy;

    public function getTaxonomyLabel(): string;

    public function getTaxonomyLabelPlural(): string;

    public function parent(): BelongsTo;

    // public function getBalanceAttribute(): float;

    public function getTreePathAttribute(): string;

    public function getHasChildrenAttribute(): bool;

    public function getCodeLabelAttribute(): string;
}
