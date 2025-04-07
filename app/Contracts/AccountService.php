<?php

namespace App\Contracts;

use Illuminate\Database\Eloquent\Collection;

interface AccountService
{
    public function getAccounts(array $filters = []): Collection|array;

    public function getSelectOptions(?int $parent = null): array;

    public function getAllByBranch(?int $parent = null): Collection|array;
}
