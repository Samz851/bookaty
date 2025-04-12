<?php

namespace App\Models;

use App\Enums\BaseAccountTaxonomy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

abstract class BaseAccount extends Model
{
    /**
     * Required fields
     *
     * name, description, code, taxonomy [branch/leaf]
     *
     * Required relationship methods
     * parent, children, parentModel, childrenModel
     */
    protected $fillable = [
        'name',
        'description',
        'code',
        'taxonomy',
        'parent_id'
    ];

    protected $appends = [
        // 'balance',
        'code_label',
        'tree_path',
        'has_children',
        'accounts_balance'
    ];

    // protected $with = ['tags'];

    protected $casts = ['taxonomy' => BaseAccountTaxonomy::class];

    public function getCodeLabelAttribute(): string
    {
        return $this->code.' - '.$this->name;
    }

    public function getTaxonomy(): BaseAccountTaxonomy
    {
        return $this->taxonomy;
    }

    public function getTaxonomyLabel(): string
    {
        return $this->taxonomy->getLabel();
    }

    public function getTaxonomyLabelPlural(): string
    {
        return $this->taxonomy->getLabelPlural();
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(AccountsBranch::class, 'parent_id');
    }

    public function getTreePathAttribute(): string
    {
        $path = [];
        $path[] = $this->name;
        $child = $this->parent()->first();
        $hasParent = true;
        while ($hasParent) {
            if (! $child) {
                $hasParent = false;
            } else {
                $path[] = $child->name;
                $child = $child->parent()->first();
            }

        }
        $treePath = implode('->', array_reverse($path));

        return $treePath;

    }

    abstract public function getHasChildrenAttribute(): bool;

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }

    // abstract public function getBalanceAttribute(): float;
}
