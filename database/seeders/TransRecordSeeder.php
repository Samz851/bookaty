<?php

namespace Database\Seeders;

use App\Enums\AccountTransactionTypes;
use App\Models\Account;
use App\Models\TransRecord;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Faker\Generator as Faker;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Support\Facades\Log;

class TransRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(Faker $faker): void
    {
        $accounts = Account::all();

        for ($i=0; $i < 50; $i++) { 
            $firstAmount = $faker->randomFloat(2, 100, 3000);
            $secondAmount = $faker->randomFloat(2, 100, 3000);
            $debitAccounts = $accounts->random($i % 10 == 0 ? 2 : 1);
            $creditAccounts = $accounts->random($i % 10 == 0 ? 1 : 2);
            //Log::info(['debitAccounts' => $debitAccounts, 'creditAccounts' => $creditAccounts], [__LINE__, __FILE__]);
            if ( $i % 10 == 0 ) {
                TransRecord::factory()
                ->state(['amount' => $firstAmount + $secondAmount])
                ->hasAttached($debitAccounts, new Sequence(
                    ['type' => AccountTransactionTypes::DEBIT,
                    'amount' => $firstAmount],
                    ['type' => AccountTransactionTypes::DEBIT,
                    'amount' => $secondAmount]
                ), 'debitAccounts')
                ->hasAttached($creditAccounts, [
                    'type' => AccountTransactionTypes::CREDIT,
                    'amount' => $firstAmount + $secondAmount
                ], 'creditAccounts')
                ->create();
            } else {
                TransRecord::factory()
                ->state(['amount' => $firstAmount + $secondAmount])
                ->hasAttached($creditAccounts, new Sequence(
                    ['type' => AccountTransactionTypes::CREDIT,
                    'amount' => $firstAmount],
                    ['type' => AccountTransactionTypes::CREDIT,
                    'amount' => $secondAmount]
                ), 'creditAccounts')
                ->hasAttached($debitAccounts, [
                    'type' => AccountTransactionTypes::DEBIT,
                    'amount' => $firstAmount + $secondAmount
                ], 'debitAccounts')
                ->create();
            }
        }
        

    }
}
