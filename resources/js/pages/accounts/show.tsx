import {
    useShow,
    IResourceComponentsProps, useBack,
    useTranslate
} from "@refinedev/core";
import { IAccount } from "../../interfaces";
import { List } from "@refinedev/antd";
import { ButtonSuccess } from "@/button";
import { RollbackOutlined } from "@ant-design/icons";
import { AccountInfoView } from "./components/accountInfoView";
import { AccountBalanceTable } from "./components/accountBalanceTable";

export const AccountShow: React.FC<IResourceComponentsProps> = () => {
    const { queryResult } = useShow<IAccount>();
    const back = useBack();
    const t = useTranslate();

    const { data } = queryResult;
    const account = data?.data;

    return (
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
            <AccountInfoView account={account} />
            <AccountBalanceTable transactions={{debit: account?.debitTransactions, credit: account?.creditTransactions}} />
        </List>
    );
};
