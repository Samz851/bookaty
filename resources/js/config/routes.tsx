import { ReactElement } from "react";
import { Route } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard";
import { AccountCreatePage, AccountShow, AccountsList } from "@/pages/accounts";
import { TransactionCreatePage, TransactionShow, TransactionsList } from "@/pages/transactions";
import { TaxesList, TaxCreatePage } from "@/pages/taxes";

import { CompaniesList, CompanyCreatePage } from "@/pages/companies";
import { ContactCreatePage, ContactsList } from "@/pages/contacts";
import { CompanyShow } from "@/pages/companies/show";
import { ContactShow } from "@/pages/contacts/show";
import { TaxShow } from "@/pages/taxes/show";
import { AccountsBranchCreatePage, AccountsBranchShow } from "@/pages/accountsBranches";
import { AccountsBranchesListPage } from "@/pages/accountsBranches/newlist";
import { CreateGeneralPage } from "@/pages/create";
import { EditOptions, HandleOptionsView, OptionsWrapper, ShowOptions } from "@/pages/options";
import { TransactionCreateForm } from "@/pages/create/forms/transaction";
import { AccountCreateForm } from "@/pages/create/forms/account";
import { AccountsBranchCreateForm } from "@/pages/create/forms/branches";
import { TaxCreateForm } from "@/pages/create/forms/tax";
import { StatementBuilder, StatementCreatePage, StatementsList } from "@/pages/statements";
import { OnboardPage } from "@/pages/onboard";
import { loadState } from "@/helpers/localStorage";
import { LocaleJsonEditor } from "@/pages/devSamples/localejson";
import { TagCreateForm } from "@/pages/create/forms/tag";
import { TagShow, TagsList } from "@/pages/tags";
import { StatementShow } from "@/pages/statements/show";
import { ReportCreatePage } from "@/pages/statements/published/create";
import { StatemenReporttShow } from "@/pages/statements/published/show";
import { ReportEditPage } from "@/pages/statements/published/edit";
import { ReportsList } from "@/pages/statements/published/list";
import CustomCalculation from "@/pages/formula/create";
import { CreateFormula } from "@/pages/formula/createReport";
import { FormulasList } from "@/pages/formula/list";
import { FormulaShow } from "@/pages/formula/show";
import { BillsList, BillCreatePage, BillShow } from "@/pages/bills";

const optionsLoader = () => {
    const identity = loadState('identity');
    if (!identity) return 0;
    return identity.options.id;
}

export const routes: ReactElement[] = [
    <Route index element={<DashboardPage />} />,
    <Route path="/jsonviewer" element={<LocaleJsonEditor />} />,
    <Route path="/options">
        <Route path="onboard" element={<OnboardPage />} />
        <Route
            // loader={optionsLoader}
            path="show/:id"
            element={<ShowOptions />}
        />
        <Route
            // loader={optionsLoader}
            path="edit/:id"
            element={<EditOptions />}
        />
    </Route>,
    <Route path="/create" element={<CreateGeneralPage />}>
        <Route path="transactions" element={<TransactionCreateForm />} />
        <Route path="accounts" element={<AccountCreateForm />} />
        <Route path="branches" element={<AccountsBranchCreateForm />} />
        <Route path="taxes" element={<TaxCreateForm />} />
        <Route path="tags" element={<TagCreateForm />} />
    </Route>,
    <Route path="/companies">
        <Route index element={<CompaniesList />} />
        <Route
            path="show/:id"
            element={<CompanyShow />}
        />
        <Route
        path="create"
        element={<CompanyCreatePage />}
        />
    </Route>,
    <Route path="/contacts">
        <Route index element={<ContactsList />} />
        <Route
            path="show/:id"
            element={<ContactShow />}
        />
        <Route
        path="create"
        element={<ContactCreatePage />}
        />
    </Route>,
    <Route path="/accounts">
        <Route index element={<AccountsList />} />
        <Route
            path="show/:id"
            element={<AccountShow />}
        />
        {/* <Route
            path="create"
            element={<CreateGeneralPage />}
        /> */}
    </Route>,
    <Route path="/tags">
        <Route index element={<TagsList />} />
        <Route
            path="show/:id"
            element={<TagShow />}
        />
        {/* <Route
            path="create"
            element={<CreateGeneralPage />}
        /> */}
    </Route>,
    <Route path="/transactions">
        <Route index element={<TransactionsList />} />
        <Route
            path="show/:id"
            element={<TransactionShow />}
        />
        {/* <Route
            path="create"
            element={<CreateGeneralPage />} /> */}
    </Route>,
    <Route path="/statements">
        <Route index element={<StatementsList />} />
        <Route
            path="show/:id"
            element={<StatementShow />}
        />
        <Route
            path="create"
            element={<StatementCreatePage />}
            />
        {/* <Route index element={<StatementBuilder />} /> */}
    </Route>,
        <Route path="/reports">
        <Route index element={<ReportsList />} />
        <Route
            path="show/:id"
            element={<StatemenReporttShow />}
        />
        <Route
            path="create/:id"
            element={<ReportCreatePage />}
            />
        <Route
            path="edit/:id"
            element={<ReportEditPage />}
        />
        {/* <Route index element={<StatementBuilder />} /> */}
    </Route>,
    <Route path="/formula">
        <Route index element={<FormulasList />} />
        <Route path="create" element={<CreateFormula/>}/>
        <Route path="show/:id" element={<FormulaShow />}/>
    </Route>,
    <Route path="/taxes">
        <Route index element={<TaxesList />} />
        <Route
            path="show/:id"
            element={<TaxShow />}
        />
        <Route
            path="create"
            element={<TaxCreatePage />} />
    </Route>,
    <Route path="/branches">
        <Route index element={<AccountsBranchesListPage />} />
        <Route
            path="show/:id"
            element={<AccountsBranchShow />}
        />
        {/* <Route
            path="create"
            element={<CreateGeneralPage />}
        /> */}
    </Route>,
    <Route path="/bills">
        <Route index element={<BillsList />} />
        <Route
            path="show/:id"
            element={<BillShow />}
        />
        <Route
            path="create"
            element={<BillCreatePage />}
        />
    </Route>,
    <Route path="/create_general">
        <Route index element={<CreateGeneralPage />} />
    </Route>
]
