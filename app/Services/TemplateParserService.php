<?php

namespace App\Services;

use App\Models\Tag;
use App\Models\TransRecord;
use App\Models\Account;
use App\Models\Formula;
use Illuminate\Support\Facades\Log;

class TemplateParserService
{
    /**
     * The content string.
     *
     * @var string
     */
    private $content;

    /**
     * Start date.
     *
     * @var string
     */
    private $from;

    /**
     * End date.
     *
     * @var string
     */
    private $to;

    /**
     * Array of placeholders.
     *
     * @var array
     */
    private $placeholders = [];

    /**
     * Array of predefined definitions.
     *
     * @var array
     */
    private $definitions = [
        "T|"  => Tag::class,
        "TR|" => TransRecord::class,
        "A|"  => Account::class,
        "F|"  => Formula::class,
    ];

    /**
     * Constructor for TemplateParserService.
     *
     * @param string $content The long string to be assigned to the content property.
     * @param string $from The starting date.
     * @param string $to The ending date.
     */
    public function __construct(string $content, string $from, string $to)
    {
        $this->content = $content;
        $this->from = $from;
        $this->to = $to;
    }
    
    /**
     * Parses the given template content by replacing placeholders with data provided.
     *
     * In the template string, any occurrence of a placeholder in the format
     * {{key}} will be replaced with its corresponding value.
     *
     * @return string The parsed template with all replacements.
     */
    public function parse(?string $content = null): string | array
    {
        $content = $content ?? $this->content;
        $definitions = $this->extractPlaceholders($content);
        $this->placeholders = $this->buildDefinitions($definitions);
        $transformedPlaceholders = $this->transformPlaceholders($this->placeholders);
        $transformPlaceholdersArray = [];
        foreach ($transformedPlaceholders as $key => $value) {
            foreach ($value as $k => $v) {
                $transformPlaceholdersArray['{{'. $key . $k . '}}'] = $v;
            }
        }

        $content = str_replace(array_keys($transformPlaceholdersArray), array_values($transformPlaceholdersArray), $content);
        // Additional parsing logic can be implemented here
        
        return $content;
    }
    
    /**
     * Extracts all instances of placeholders matching the pattern {{*}} from the given string.
     *
     * @param string $content The string to search in.
     * @return array An array of all matched placeholder strings.
     */
    private function extractPlaceholders(string $content): array
    {
        // Use a non-greedy regex pattern to match any instance like {{...}}
        preg_match_all('/{{(.*?)}}/', $content, $matches);
        return $matches[1];
    }

    /**
     * Splits the given string by the first occurrence of the "|" character.
     * The first element of the returned array includes all characters before and including the pipe,
     * and the second element contains all characters after the pipe.
     *
     * @param string $input The input string to split.
     * @return array An array with two elements: [prefix including pipe, rest of the string].
     */
    private function splitByPipe(string $input): array
    {
        $pos = strpos($input, '|');
        if ($pos === false) {
            return [$input, ''];
        }
        return [substr($input, 0, $pos + 1), substr($input, $pos + 1)];
    }
    
    /**
     * Processes the extracted definitions by splitting each definition string at the first occurrence of the pipe ("|")
     * and constructing an associative array with keys "T|", "TR|", "A|".
     * Each value in the returned array is an array of the definitions (the part after the "|")
     * that match the particular key.
     *
     * @param array $extractedDefinitions The array returned by extractPlaceholders.
     * @return array An associative array with keys "T|", "TR|", "A|" and values as arrays of definition values.
     */
    private function buildDefinitions(array $extractedDefinitions): array
    {
        $result = [
            "T|"  => [],
            "TR|" => [],
            "A|"  => [],
            "F|"  => [],
        ];

        foreach ($extractedDefinitions as $definition) {
            $term = $this->splitByPipe($definition);
            if (array_key_exists($term[0], $result)) {
                $result[$term[0]][] = $term[1];
            }
        }
        return $result;
    }

    /**
     * Removes empty arrays from the placeholders property and returns the filtered array.
     *
     * @return array The filtered placeholders array without empty value arrays.
     */
    private function transformPlaceholders( array $placeholders): array
    {
        $result = [];
        $filteredPlaceholders = array_filter($placeholders, function($value) {
            return !empty($value);
        });
        
        foreach ($filteredPlaceholders as $key => $value) {
            switch ($key) {
                case "T|":
                    $this->content = str_replace($key, $value, $this->content);
                    break;
                case "TR|":
                    $result[$key] = $this->getTransactions($value);
                    break;
                case "A|":
                    $result[$key] = $this->getAccounts($value);
                    break;
                case "F|":
                    $result[$key] = $this->getFormulas($value);
                    break;
            }
        }
        return $result;
    }

    /**
     * Get transactions for given codes between from and to dates.
     * 
     * @param array $codes Array of transaction codes
     * @return array Transaction data
     */
    private function getTransactions(array $codes): array
    {
        $records = TransRecord::whereIn('code', $codes)
            ->whereBetween('date', [$this->from, $this->to])
            ->select('code', 'date', 'amount')
            ->get();
        $records = $records->toArray();
        $result = [];
        foreach ($records as $record) {
            $result[$record['code']] = $record['amount'];
        }

        return $result;
    }

    /**
     * Get accounts for given codes.
     * 
     * @param array $codes Array of account codes
     * @return array Account data
     */
    private function getAccounts(array $codes): array
    {
        $queries = [
            'type' => 'all',
            'code' => $codes,
            '_from' => $this->from,
            '_to' => $this->to
        ];
        $accountService = new AccountsBalanceService($codes, $this->from, $this->to);
        $accounts = $accountService->getAllBalances();


        return $accounts;
    }

    private function getFormulas(array $codes): array
    {
        $formulas = Formula::whereIn('code', $codes)
            ->select('code', 'name', 'formula')
            ->get();
        $result = [];
        foreach ($formulas as $formula) {
            $result[$formula['code']] = $this->parseFormula($formula['formula']);
        }
        return $result;
    }
    
    private function parseFormula(string $formula): string
    {
        $formulaService = new FormulaService();
        $originalFormula = $formula;
        $formulaDefinitions = $this->extractPlaceholders($formula);
        $formulaDefinitions = $this->buildDefinitions($formulaDefinitions);
        $transformedPlaceholders = $this->transformPlaceholders($formulaDefinitions);
        $transformPlaceholdersArray = [];
        foreach ($transformedPlaceholders as $key => $value) {
            foreach ($value as $k => $v) {
                $transformPlaceholdersArray['{{'. $key . $k . '}}'] = $v;
            }
        }
        $formula = str_replace(array_keys($transformPlaceholdersArray), array_values($transformPlaceholdersArray), $originalFormula);
        $formula = $formulaService->calculateFormula($formula);
        return $formula;
    }

    /**
     * Returns a JSON representation of the content and its extracted placeholders.
     *
     * @return string JSON encoded string of content details.
     */
    public function toJson(): string
    {
        return json_encode([
            'result'   => $this->parse(), 
            'extracted' => $this->extractPlaceholders($this->content)
        ]);
    }
} 