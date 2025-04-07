import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { Flex, Grid, Table } from "antd";
import { IAccount, ITransaction } from "@/interfaces";
import { CardWithContent, Drawer } from "@/components";

export const TransactionShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const { list } = useNavigation();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<ITransaction>();

    const { data } = queryResult;
    const transaction = data?.data;
    const { Column } = Table;
    return (
        <Drawer
            open
            onClose={() => back()}
            width={breakpoint.sm ? "736px" : "100%"}
        >
            <Flex
                vertical
                gap={32}
                style={{
                    padding: "32px",
                }}
            >
                <CardWithContent title={transaction?.name}>
                    <p>Date: {transaction?.date}</p>
                    <p>
                        Description: {transaction?.description}
                    </p>
                    <p>Amount: {transaction?.amount}</p>
                    {
                        transaction?.credit_accounts?.length && (
                            <CardWithContent title={"Credit Accounts"}>
                                <Table dataSource={transaction?.credit_accounts}>
                                    <Column
                                        title="Name"
                                        dataIndex="name"
                                        key="name"
                                    />
                                    <Column
                                        title="Amount"
                                        dataIndex={["pivot", "amount"]}
                                        key="amount"
                                    />
                                </Table>
                            </CardWithContent>
                        )
                    }
                    {
                        transaction?.debit_accounts?.length && (
                            <CardWithContent title={"Debit Accounts"}>
                                <Table dataSource={transaction?.debit_accounts}>
                                    <Column
                                        title="Name"
                                        dataIndex="name"
                                        key="name"
                                    />
                                    <Column
                                        title="Amount"
                                        dataIndex={["pivot", "amount"]}
                                        key="amount"
                                    />
                                </Table>
                            </CardWithContent>
                        )
                    }
                </CardWithContent>

            </Flex>
        </Drawer>
    );
};
