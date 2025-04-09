<?php

namespace App\Enums;

enum AccountTransactionTypes: string
{
    case DEBIT = 'debit';
    case CREDIT = 'credit';
}
