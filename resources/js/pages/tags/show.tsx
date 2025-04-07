import { ITag } from "@/interfaces";
import { CardWithContent, Drawer } from "@/components";
import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { Flex, Grid, Table } from "antd";

export const TagShow = () => {

    const back = useBack();
    const { list } = useNavigation();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<ITag>();

    const { data } = queryResult;
    const tag = data?.data;
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
                <CardWithContent title={tag?.label}>
                    <p>
                        Description: {tag?.description}
                    </p>
                    {
                        tag?.accounts?.length && (
                            <CardWithContent title={"Credit Accounts"}>
                                <Table dataSource={tag?.accounts}>
                                    <Column
                                        title="Name"
                                        dataIndex="name"
                                        key="name"
                                    />
                                    <Column
                                        dataIndex={["accounts_balance"]}
                                        title="Total Debit"
                                        render={(_, record) => _.debit_total.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
                                    />
                                    <Column
                                        dataIndex={["accounts_balance"]}
                                        title="Total Credit"
                                        render={(_, record) => _.credit_total.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
                                    />
                                    <Column
                                        dataIndex={["accounts_balance"]}
                                        title="Balance"
                                        render={(_, record) => _.balance.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
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
