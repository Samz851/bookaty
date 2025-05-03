import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { Flex, Grid, Table } from "antd";
import { IBill } from "@/interfaces";
import { CardWithContent, Drawer } from "@/components";

export const BillShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const { list } = useNavigation();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<IBill>();

    const { data } = queryResult;
    const bill = data?.data;
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
                <CardWithContent title={bill?.description}>
                    <p>Date: {bill?.date}</p>
                    <p>Amount: {bill?.amount}</p>
                    <p>Status: {bill?.status}</p>
                    <p>Due Date: {bill?.due_date}</p>
                    <p>Notes: {bill?.notes}</p>
                    {
                        bill?.attachments?.length && (
                            <CardWithContent title={"Attachments"}>
                                <Table dataSource={bill?.attachments}>
                                    <Column
                                        title="Name"
                                        dataIndex="name"
                                        key="name"
                                    />
                                    <Column
                                        title="Type"
                                        dataIndex="type"
                                        key="type"
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