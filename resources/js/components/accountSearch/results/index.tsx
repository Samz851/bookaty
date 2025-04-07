import { IAccount } from "@/interfaces";
import { EyeOutlined, SearchOutlined } from "@ant-design/icons"
import { useNavigation, useTranslate } from "@refinedev/core";
import { Button, Table, Typography } from "antd"

export const ResultsTable = ({data}) => {
    const t = useTranslate();
    const { show } = useNavigation();
    return (
        <Table dataSource={data}
                rowKey="code"
                scroll={{ x: true }}
            >
                <Table.Column
                    key="code"
                    dataIndex="code"
                    title="ID #"
                    rowScope="row"
                    render={(value) => (
                        <Typography.Text
                            style={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            {value}
                        </Typography.Text>
                    )}
                />
                <Table.Column
                    key="name"
                    dataIndex="name"
                    title={t("users.fields.name")}
                />
                <Table.Column<IAccount>
                    fixed="right"
                    title={t("table.actions")}
                    render={(_, record) => (
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => show('accounts', record.id, "push")}
                        />
                    )}
                />
        </Table>
    )
}