<?php

namespace App\Traits\Auth;

use App\Requestan\Facades\StringGenerator;
use App\Requestan\Notifications\Auth\TemporaryCodeNotification;
use App\Requestan\Notifications\Auth\TemporaryCodeNotificationSMS;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redis;

trait CanGenerateCode
{
    /**
     * Temporary Code Key
     * 
     * @var string|null
     */
    private $temporaryCodeKey;

    /**
     * Get user's Temporary Code Key
     *
     * @return string
     */
    private function getTemporaryCodeKey(): string
    {
        return $this->temporaryCodeKey 
        ?? $this->temporaryCodeKey = config('auth.keys.' . $this->user_type . '.temporary_code') . '-' . $this->id;
    }

    /**
     * Save the temporary code
     *
     * @param string $code
     * @return void
     */
    public function setTemporaryCode( string $code ): void
    {
        Redis::set($this->getTemporaryCodeKey(), $code);
    }

    /**
     * Generate temporary code
     * 
     * @return string
     */
    public function generateTemporaryCode(array $options = [
        'letters' => true,
        'numbers' => true,
        'uppercase' => true,
        'special_chars' => false,
        'limit' => 8
    ]): string
    {
        return StringGenerator::generate($options);
    }

    /**
     * Get the temporary code
     *
     * @return string|null
     */
    public function getTemporaryCode(): ?string
    {
        return Redis::get($this->getTemporaryCodeKey()); 
    }

    /**
     * Verify the temporary code
     *
     * @param string $code
     * @return boolean
     */
    public function verifyTemporaryCode( string $code ): bool
    {
        return $code === $this->getTemporaryCode() 
        ? $this->deleteTemporaryCode() 
        : false;
    }

    /**
     * Delete the temporary code
     *
     * @return boolean
     */
    public function deleteTemporaryCode(): bool
    {
        Redis::del($this->getTemporaryCodeKey());
        return true;
    }

    /**
     * Send the temporary code notification.
     *
     * @return void
     */
    public function sendTemporaryCodeNotificationEmail(): void
    {
        $this->notify(new TemporaryCodeNotification);
    }

    /**
     * Send the temporary code notification.
     *
     * @return void
     */
    public function sendTemporaryCodeNotificationSMS(): void
    {
        Log::info('sending sms not');
        $this->notify(new TemporaryCodeNotificationSMS);
    }
}