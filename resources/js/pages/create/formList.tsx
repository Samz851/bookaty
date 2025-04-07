import { AccountCreatePage } from "../accounts";
import { AccountsBranchCreatePage } from "../accountsBranches";
import { TransactionCreatePage } from "../transactions";
import { AccountCreateForm } from "./forms/account";
import { AccountsBranchCreateForm } from "./forms/branches";
import { TransactionCreateForm } from "./forms/transaction";
// import { AccountStep } from "./forms/account";
// import { BranchStep } from "./forms/branch";
// import { TransactionStep } from "./forms/transaction";

export const FormList = {
    accounts: AccountCreateForm,
    branches: AccountsBranchCreateForm,
    transactions: TransactionCreateForm,
}
