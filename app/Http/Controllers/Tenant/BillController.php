<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BillController extends Controller
{
    /**
     * Display a listing of the bills.
     */
    public function index()
    {
        $bills = Bill::with(['vendor', 'transactionRecord'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bills);
    }

    /**
     * Store a newly created bill in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'account_id' => 'required|exists:accounts,id',
                'amount' => 'required|numeric|min:0',
                'due_date' => 'required|date',
                'description' => 'nullable|string',
                'status' => 'required|in:pending,paid,overdue,cancelled',
                'transactions' => 'nullable|array',
                'transactions.*.amount' => 'required|numeric|min:0',
                'transactions.*.type' => 'required|in:debit,credit',
                'transactions.*.description' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $bill = Bill::create([
                'account_id' => $validated['account_id'],
                'amount' => $validated['amount'],
                'due_date' => $validated['due_date'],
                'description' => $validated['description'] ?? null,
                'status' => $validated['status'],
            ]);

            if (isset($validated['transactions'])) {
                foreach ($validated['transactions'] as $transaction) {
                    $bill->transactions()->create([
                        'amount' => $transaction['amount'],
                        'type' => $transaction['type'],
                        'description' => $transaction['description'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Bill created successfully',
                'bill' => $bill->load(['account', 'transactions'])
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified bill.
     */
    public function show(Bill $bill)
    {
        return response()->json($bill->load(['account', 'transactions']));
    }

    /**
     * Update the specified bill in storage.
     */
    public function update(Request $request, Bill $bill)
    {
        try {
            $validated = $request->validate([
                'account_id' => 'sometimes|required|exists:accounts,id',
                'amount' => 'sometimes|required|numeric|min:0',
                'due_date' => 'sometimes|required|date',
                'description' => 'nullable|string',
                'status' => 'sometimes|required|in:pending,paid,overdue,cancelled',
            ]);

            DB::beginTransaction();

            $bill->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Bill updated successfully',
                'bill' => $bill->load(['account', 'transactions'])
            ]);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified bill from storage.
     */
    public function destroy(Bill $bill)
    {
        try {
            DB::beginTransaction();

            $bill->transactions()->delete();
            $bill->delete();

            DB::commit();

            return response()->json([
                'message' => 'Bill deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete bill',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add a transaction to the bill.
     */
    public function addTransaction(Request $request, Bill $bill)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'type' => 'required|in:debit,credit',
                'description' => 'nullable|string',
            ]);

            DB::beginTransaction();

            $transaction = $bill->transactions()->create($validated);

            // Update bill status based on transactions
            $this->updateBillStatus($bill);

            DB::commit();

            return response()->json([
                'message' => 'Transaction added successfully',
                'transaction' => $transaction
            ], 201);

        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to add transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the bill status based on its transactions.
     */
    private function updateBillStatus(Bill $bill)
    {
        $totalPaid = $bill->transactions()
            ->where('type', 'credit')
            ->sum('amount');

        if ($totalPaid >= $bill->amount) {
            $bill->update(['status' => 'paid']);
        } elseif ($bill->due_date < now()) {
            $bill->update(['status' => 'overdue']);
        } else {
            $bill->update(['status' => 'pending']);
        }
    }
} 