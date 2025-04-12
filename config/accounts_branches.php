<?php

return [
    "max_level" => 5,
    "level_code_masks" => [
        1 => "** 00 -- -- --",
        2 => "00 ** -- -- --",
        3 => "00 00 ** -- --",
        4 => "00 00 00 ** --",
        5 => "00 00 00 00 **"
    ],
    "branches" => [
        "Assets" => [
            "Current Assets" => [
                "Cash and Cash Equivalents",
                "Accounts Receivable",
                "Inventory",
                "Prepaid Expenses",
            ],
            "Fixed Assets" => [
                "Land",
                "Buildings",
                "Equipment",
                "Vehicles",
                "Intangible Assets" => [
                    "Goodwill",
                    "Patents",
                    "Copyrights",
                    "Trademarks",
                ],
            ],
            "Investment Assets" => [
                "Stocks",
                "Bonds",
                "Mutual Funds",
            ],
        ],
        "Liabilities" => [
            "Current Liabilities" => [
                "Accounts Payable",
                "Accrued Expenses",
                "Short-Term Debt",
            ],
            "Long-Term Liabilities" => [
                "Long-Term Debt",
                "Mortgages",
            ],
        ],
        "Equity" => [
            "Paid-in Capital",
            "Retained Earnings",
            "Treasury Stock",
        ],
        "Revenue" => [
            "Sales",
            "Service Revenue",
            "Interest Income",
            "Gain on Sale of Assets",
        ],
        "Expenses" => [
            "Cost of Goods Sold",
            "Selling, General & Administrative Expenses",
            "Interest Expense",
            "Tax Expense",
            "Loss on Sale of Assets",
        ],
    ]
    
];
