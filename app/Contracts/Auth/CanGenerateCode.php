<?php

namespace App\Contracts\Auth;

interface CanGenerateCode
{
    /**
     * Save the temporary code
     */
    public function setTemporaryCode(string $code): void;

    /**
     * Generate temporary code
     */
    public function generateTemporaryCode(): string;

    /**
     * Get the temporary code
     */
    public function getTemporaryCode(): ?string;

    /**
     * Verify the temporary code
     */
    public function verifyTemporaryCode(string $code): bool;

    /**
     * Delete the temporary code
     */
    public function deleteTemporaryCode(): bool;

    /**
     * Send the temporary code notification.
     */
    public function sendTemporaryCodeNotificationEmail(): void;

    /**
     * Send the temporary code notification.
     */
    public function sendTemporaryCodeNotificationSMS(): void;
}
