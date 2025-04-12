<?php

namespace Database\Seeders;

use App\Models\Formula;
use App\Models\TransRecord;
use App\Services\AccountQueryBuilder;
use Database\Factories\FormulaFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $symbols = ['A|', 'TR|', 'T|', 'F|'];
        $queryBuilder = new AccountQueryBuilder();
        $codes = ['01', '02', '03', '04', '05'];
        $formulaArray = [
            'ABS', 'ACOS', 'ACOSH', 'ASIN', 'ASINH', 'ATAN', 'ATAN2', 'ATANH', 'CEILING', 'COMBIN',
            'COS', 'COSH', 'DEGREES', 'EVEN', 'EXP', 'FACT', 'FACTDOUBLE', 'FLOOR', 'GCD', 'INT',
            'LCM', 'LN', 'LOG', 'LOG10', 'MDETERM', 'MINVERSE', 'MMULT', 'MOD', 'ODD', 'PI',
            'POWER', 'PRODUCT', 'QUOTIENT', 'RADIANS', 'RAND', 'RANDBETWEEN', 'ROMAN', 'ROUND',
            'ROUNDDOWN', 'ROUNDUP', 'SERIESSUM', 'SIGN', 'SIN', 'SINH', 'SQRT', 'SQRTPI', 'SUBTOTAL',
            'SUM', 'SUMIF', 'SUMPRODUCT', 'SUMSQ', 'TAN', 'TANH', 'TRUNC'
        ];

        foreach ($codes as $code) {

            for ($i=0; $i < 3; $i++) { 
                $accounts = $queryBuilder->quickSearch($code)->random($i % 2 == 0 ? 2 : 3);
                $formula = "{$formulaArray[rand(0, count($formulaArray) - 1)]}(";
                foreach ($accounts as $account) {
                    $formula .= "{{" . $symbols[0]. $account->code . "}},";
                }
                $formula .= ")";

                Formula::factory()
                    ->state(['formula' => $formula])
                    ->create();
            }
        }

        for ($i=0; $i < 10; $i++) { 
            $transactions = TransRecord::all()->random($i % 2 == 0 ? 2 : 3);
            $formula = "{$formulaArray[rand(0, count($formulaArray) - 1)]}(";
            foreach ($transactions as $transaction) {
                $formula .= "{{" . $symbols[1]. $transaction->code . "}},";
            }
            $formula .= ")";

            Formula::factory()
                ->state(['formula' => $formula])
                ->create();
        }

    }
}
