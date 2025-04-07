<?php
namespace App\Services;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Contracts\Support\Jsonable;
use Illuminate\Database\Eloquent\Model;

class IdentityFactory implements Arrayable
{

    private \App\Models\Organization $organization;
    private \App\Models\Options $options;

    public function __construct(
        private \App\Models\User $user, 
    )
    {
        $this->organization = tenant();
        $this->options = tenant()->options;
    }
    public function toArray(): array
    {
        return [
            'user' => $this->user->only(['id', 'name']),
            'organization' => $this->organization->only(['id', 'logo', 'onboarded']),
            'options' => $this->options->only([
                'id', 'fiscal_year', 
                'fiscal_year_start', 'description',
                'option_1', 'option_2', 'option_3', 'option_4',
            ]),
        ];
    }
}