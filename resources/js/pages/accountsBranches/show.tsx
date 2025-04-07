import {
    useShow,
    IResourceComponentsProps, useBack,
    useTranslate
} from "@refinedev/core";
import { Grid } from "antd";
import { List } from "@refinedev/antd";

import { IAccountsBranch } from "@/interfaces";
import {
    Drawer
} from "@/components";
import { AccountsBranchView } from "./components/accountsBranchView";
import { ButtonSuccess } from "@/button";
import { RollbackOutlined } from "@ant-design/icons";
import { AccountInfoView } from "../accounts/components/accountInfoView";
import { AccountBalanceTable } from "../accounts/components/accountBalanceTable";

export const AccountsBranchShow: React.FC<IResourceComponentsProps> = () => {
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<IAccountsBranch>();
    const back = useBack();
    const t = useTranslate();

    const { data } = queryResult;
    const accountsBranch = data?.data;

    return (
        // <Drawer
        //     open
        //     onClose={() => back()}
        //     width={breakpoint.sm ? "736px" : "100%"}
        // >
        //     <AccountsBranchView accountsBranch={accountsBranch} />
        // </Drawer>
        <List
            breadcrumb={false}
            headerButtons={(props) => [
                // // <ExportButton key={useId()} onClick={triggerExport} loading={isLoading} />,
                <ButtonSuccess
                    key="back"
                    icon={<RollbackOutlined/>}
                    onClick={() => back()}
                >
                    {t("buttons.return")}
                </ButtonSuccess>,
            ]}
        >
            <AccountInfoView account={accountsBranch} />
            <AccountBalanceTable transactions={{debit: accountsBranch?.debitTransactions, credit: accountsBranch?.creditTransactions}} />
        </List>
    );
};
