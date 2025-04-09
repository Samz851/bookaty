<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;

class ArrayFormatters
{
    public static function rename_array_keys(array $array, array $keys): array
    {
        $newArray = [];
        foreach ($array as $key => $value) {
            if (array_key_exists($key, $keys) && !empty($value)) {
                if (is_array($value)) {
                    $newArray[$keys[$key]] = array_map(fn($record) => self::rename_array_keys($record, $keys), $value);
                    // $newArray[$keys[$key]] = array_map([self::class, 'rename_array_keys'], $value, [$keys]);
                } else {
                    $newArray[$keys[$key]] = $value;
                }

            } else if ( !empty($value)) {
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }

    public static function removeLeafAccounts(array $array, int $level): array
    {
        $newArray = [];
        foreach ($array as $key => $value) {
            Log::info([$key, $value], [__LINE__, __FILE__]);
            $pathLength = count(explode('->', $value['tree_path']));
            if ( $pathLength < $level ) {
                Log::info([$pathLength, $value], [__LINE__, __FILE__]);
                if ( isset($value['children']) && ! empty(isset($value['children'])) ) {
                    $value['children'] = self::removeLeafAccounts($value['children'], $level);
                }
                $newArray[$key] = $value;
            }
        }
        return $newArray;
    }

    public static function removeEmptyItems(array $array): array
    {
        foreach ($array as $key => &$value) {
            if (empty($value)) {
                unset($array[$key]);
            } else if (is_array($value)) {
                $value = self::removeEmptyItems($value);
            }
        }
        return $array;
    }

    public static function eliminate_prefixes($arr) {
        // Sort the array by string length in ascending order
        usort($arr, function($a, $b) {
            return strlen($a) - strlen($b);
        });
    
        $result = [];
    
        foreach ($arr as $str) {
            // Check if the current string is a prefix of any previously added string
            $is_prefix = false;
            foreach ($result as $resStr) {
                if (strpos($str, $resStr) === 0) {
                    $is_prefix = true;
                    break;
                }
            }
            // Add to the result if it is not a prefix
            if (!$is_prefix) {
                $result[] = $str;
            }
        }
    
        return $result;
    }
}
