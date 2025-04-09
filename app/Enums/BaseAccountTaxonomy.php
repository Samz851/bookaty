<?php

namespace App\Enums;

use Illuminate\Support\Str;

enum BaseAccountTaxonomy: string
{
    case LEAF = 'leaf';
    case BRANCH = 'branch';

    public function getLabel(): string
    {
        return strtoupper($this->value);
    }

    public function getLabelPlural(): string
    {
        return Str::plural($this->getLabel());
    }

    public static function make(string $taxonomy): self
    {
        return match ($taxonomy) {
            'leaf' => self::LEAF,
            'branch' => self::BRANCH,
            default => self::LEAF,
        };
    }
}
