<?php

namespace App\Http\Controllers\Tenant;

use App\Models\Account;
use App\Models\AccountsBranch;
use App\Models\Formula;
use App\Models\Tag;
use App\Models\TransRecord;
use App\Services\TagService;
use ChrisKonnertz\StringCalc\StringCalc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FormulaController extends Controller
{
    //
    public function index()
    {
        $formulas = Formula::all();
        return response()->json($formulas);
    }

    public function store(Request $request)
    {
        $formula = Formula::create($request->all());
        return response()->json($formula, 201);
    }

    public function update(Request $request, $id)
    {
        $formula = Formula::findOrFail($id);
        $formula->update($request->all());
        return response()->json($formula, 200);
    }

    public function destroy($id)
    {
        $formula = Formula::findOrFail($id);
        $formula->delete();
        return response()->json(['message' => 'Formula deleted successfully'], 204);
    }

    public function validateFormula(Request $request)
    {
        $formula = $request->input('formula');
        preg_match_all('/({{[A-Z]{1,2}\|{1}\w+\s?\w*}})/', $formula, $variables);
        foreach ($variables[1] as $variable) {
            $cleanVariable = str_replace('{{', '', $variable);
            $cleanVariable = str_replace('}}', '', $cleanVariable);
            $cleanVariable = explode('|', $cleanVariable);
            $symbol = $cleanVariable[0];
            $code = $cleanVariable[1];
            Log::info($cleanVariable, [__FILE__, __LINE__]);
            if ($symbol == 'A') {
                if (strlen($code) == 10) {
                    $val = Account::where('code', $code)->first();
                    Log::info($val->accounts_balance, [__FILE__, __LINE__]);
                    $balance = $val->accounts_balance->balance;
                } else {
                    $val = AccountsBranch::where('code', $code)->first();
                    Log::info($val->accounts_balance['balance'], [__FILE__, __LINE__]);
                    $balance = $val->accounts_balance['balance'];
                }
            } elseif ($symbol === 'TR') {
                $val = TransRecord::where('code', $code)->first();
                $balance = $val->amount;
                
            }else{
                $service = new TagService();

                $val = Tag::where('label', $code)->first();
                $balance = $service->getTagMembersBalanceByRange($val->id, "11/11/23", "11/11/24");
                

            }
            Log::info([$cleanVariable, $variable], [__FILE__, __LINE__]);
            $formula = str_replace($variable, $balance, $formula);
        }
        Log::info($variables[1], [__FILE__, __LINE__]);
        Log::info('Formula: ' . $formula, [__FILE__, __LINE__]);
        $stringCalc = new StringCalc();
        try {
            $result = $stringCalc->calculate($formula);
            Log::info('Result: ' . $result, [__FILE__, __LINE__]);
            return response(['success' => true]);
        } catch (\Exception $e) {
            Log::info('Error: ' . $e->getMessage(), [__FILE__, __LINE__]);
            return response(['success' => false]);
        }
        // $result = $stringCalc->calculate($formula);
        // Log::info('Result: ' . $result, [__FILE__, __LINE__]);
    }

    public function show(Request $request, int $formula)
    {
        $formula = Formula::find($formula);

        return response()->json($formula);
    }
}
