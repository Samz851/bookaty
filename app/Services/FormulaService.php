<?php

namespace App\Services;

use App\Models\Formula;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class FormulaService
{

    /**
     * array of formula functions
     */
    private $formulaFunctions = [
        'ABS', 'ACOS', 'ACOSH', 'ASIN', 'ASINH', 'ATAN', 'ATAN2', 'ATANH', 'CEILING', 'COMBIN',
        'COS', 'COSH', 'DEGREES', 'EVEN', 'EXP', 'FACT', 'FACTDOUBLE', 'FLOOR', 'GCD', 'INT',
        'LCM', 'LN', 'LOG', 'LOG10', 'MDETERM', 'MINVERSE', 'MMULT', 'MOD', 'ODD', 'PI',
        'POWER', 'PRODUCT', 'QUOTIENT', 'RADIANS', 'RAND', 'RANDBETWEEN', 'ROMAN', 'ROUND',
        'ROUNDDOWN', 'ROUNDUP', 'SERIESSUM', 'SIGN', 'SIN', 'SINH', 'SQRT', 'SQRTPI', 'SUBTOTAL',
        'SUM', 'SUMIF', 'SUMPRODUCT', 'SUMSQ', 'TAN', 'TANH', 'TRUNC'
    ];
    /**
     * Get all formulas
     *
     * @return Collection
     */
    public function getAllFormulas(): Collection
    {
        return Formula::all();
    }

    /**
     * Get formula by ID
     *
     * @param int $id
     * @return Formula
     */
    public function getFormulaById(int $id): Formula
    {
        return Formula::findOrFail($id);
    }

    /**
     * Get formula by code
     *
     * @param string $code
     * @return Formula
     */
    public function getFormulaByCode(string $code): Formula
    {
        return Formula::where('code', $code)->firstOrFail();
    }

    /**
     * Create a new formula
     *
     * @param array $data
     * @return Formula
     */
    public function createFormula(array $data): Formula
    {
        return Formula::create($data);
    }

    /**
     * Update an existing formula
     *
     * @param int $id
     * @param array $data
     * @return Formula
     */
    public function updateFormula(int $id, array $data): Formula
    {
        $formula = $this->getFormulaById($id);
        $formula->update($data);
        return $formula;
    }

    /**
     * Delete a formula
     *
     * @param int $id
     * @return bool
     */
    public function deleteFormula(int $id): bool
    {
        $formula = $this->getFormulaById($id);
        return $formula->delete();
    }

    /**
     * Validate formula syntax
     *
     * @param string $content
     * @return bool
     */
    public function validateFormulaSyntax(string $content): bool
    {
        // Basic validation for balanced parentheses and placeholders
        $isBalancedParentheses = $this->checkBalancedParentheses($content);
        $isValidPlaceholders = $this->validatePlaceholders($content);
        
        return $isBalancedParentheses && $isValidPlaceholders;
    }

    /**
     * Check if parentheses are balanced in formula
     *
     * @param string $content
     * @return bool
     */
    private function checkBalancedParentheses(string $content): bool
    {
        $count = 0;
        for ($i = 0; $i < strlen($content); $i++) {
            if ($content[$i] === '(') {
                $count++;
            } elseif ($content[$i] === ')') {
                $count--;
            }
            if ($count < 0) {
                return false;
            }
        }
        return $count === 0;
    }

    /**
     * Validate placeholders in formula
     *
     * @param string $content
     * @return bool
     */
    private function validatePlaceholders(string $content): bool
    {
        $pattern = '/{{(A|T|TR|F)\|[^}]+}}/';
        preg_match_all('/{{.*?}}/', $content, $matches);
        
        foreach ($matches[0] as $placeholder) {
            if (!preg_match($pattern, $placeholder)) {
                return false;
            }
        }
        
        return true;
    }

    public function calculateFormula(string $formula): float 
    {
        // Remove whitespace
        $formula = preg_replace('/\s+/', '', $formula);
        
        // Replace Excel functions with PHP equivalents
        $formula = preg_replace_callback('/([A-Z]+)\((.*?)\)/', function($matches) {
            $function = $matches[1];
            $args = $matches[2];
            
            if (!in_array($function, $this->formulaFunctions)) {
                throw new \InvalidArgumentException("Unsupported function: $function");
            }
            
            switch($function) {
                case 'SUM':
                    $numbers = explode(',', $args);
                    return array_sum(array_map('floatval', $numbers));
                case 'POWER':
                    list($base, $exp) = explode(',', $args);
                    return pow(floatval($base), floatval($exp));
                case 'SQRT':
                    return sqrt(floatval($args));
                case 'ABS':
                    return abs(floatval($args));
                case 'ROUND':
                    list($number, $decimals) = explode(',', $args);
                    return round(floatval($number), intval($decimals));
                case 'PI':
                    return M_PI;
                case 'SIN':
                    return sin(floatval($args));
                case 'COS':
                    return cos(floatval($args));
                case 'TAN':
                    return tan(floatval($args));
                // Add more function implementations as needed
                default:
                    throw new \InvalidArgumentException("Function not implemented: $function");
            }
        }, $formula);

        // Evaluate the resulting mathematical expression
        $formula = preg_replace('/[^0-9+\-.*\/().,]/', '', $formula);
        
        if (empty($formula)) {
            return 0;
        }

        try {
            return eval('return ' . $formula . ';');
        } catch (\Throwable $e) {
            throw new \InvalidArgumentException("Invalid formula: $formula");
        }
    }
} 