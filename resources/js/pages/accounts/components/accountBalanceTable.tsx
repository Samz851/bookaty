import { ITransaction, TransactionTableShort } from "@/interfaces";
import { useLink, useNavigation } from "@refinedev/core";
import { Col, Row, Table, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { resources } from '../../../config/resources';


type Props = {
    transactions?: {
        debit?: ITransaction[] | TransactionTableShort[];
        credit?: ITransaction[] | TransactionTableShort[];
    };
}
export const AccountBalanceTable = ({transactions}: Props) => {
    const { t } = useTranslation();
    const {showUrl} = useNavigation();
    const Link= useLink();

    const { Column, ColumnGroup } = Table;
    const totalDebit = transactions?.debit?.reduce((prev, current) => {
        return prev + parseFloat(current.dbtrans.amount as string)
    }, 0);
    const totalCredit = transactions?.credit?.reduce((prev, current) => {
        return prev + parseFloat(current.crtrans.amount as string)
    }, 0);

    return (
        <Row>
            <Col span={12}>
                <Table
                rowKey={(record) => record.id}
                    pagination={false}
                    bordered
                    dataSource={transactions?.debit}
                    title={() => <Typography.Title level={5}>{t("accounts.debit")}</Typography.Title>}
                    footer={() => (
                        <Row justify={"space-between"} gutter={8}>
                            <Col span={16}>
                                {"Total"}
                            </Col>
                            <Col span={8}>
                                { totalDebit?.toLocaleString('en-US', {style: 'currency', currency: 'EGP' }) }
                            </Col>
                        </Row>
                    )}
                >
                    <Column
                        title={t("accounts.fields.date") as any}
                        dataIndex="date"
                        key="date"
                    />
                    {/* <Column<ITransaction["credit_accounts"]>
                        // title={t("transactions.fields.credit_account") as any}
                        title={() => 
                            <Row justify={"space-between"} gutter={8}>
                                <Col span={24}>
                                    <Row justify={"center"}>
                                        <Typography.Text>
                                            {t("transactions.fields.credit_account")}
                                        </Typography.Text>
                                    </Row>
                                    <Row justify={"space-between"} gutter={8}>
                                        <Col span={16}>
                                            <Typography.Text>
                                                {"Name"}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={8}>
                                            <Typography.Text>
                                                {"Amount"}
                                            </Typography.Text>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                        }
                        dataIndex={['credit_accounts']}
                        key="name"
                        // children={[]}
                        render={(value) => 
                            <>
                            {
                                value.map((account, idx) => (
                                    <Row key={idx} justify={"space-between"} gutter={8}>
                                        <Col span={16}>
                                            <Typography.Text>
                                                {account.name}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={8}>
                                            <Typography.Text>
                                                {account.pivot.amount.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                ))
                            }
                            </>
                        }
                    /> */}
                    <Column
                        title={t("transactions.transactions") as any}
                        dataIndex={["code"]}
                        key="crtrans"
                        render={(value) =>
                            <Link 
                                to= {showUrl("transactions", value)}
                                 >
                                    {value}
                                 </Link>

                        }
                    />
                    <Column
                        title={t("transactions.fields.amount") as any}
                        dataIndex={["dbtrans","amount"]}
                        key="dbtrans"
                    />
                </Table>
            </Col>
            <Col span={12}>
                <Table
                rowKey={(record) => record.id}
                    pagination={false}
                    bordered
                    dataSource={transactions?.credit}
                    title={() => <Typography.Title level={5}>{t("accounts.credit")}</Typography.Title>}
                    footer={() => (
                        <Row justify={"space-between"} gutter={8}>
                            <Col span={16}>
                                {"Total"}
                            </Col>
                            <Col span={8}>
                                { totalCredit?.toLocaleString('en-US', {style: 'currency', currency: 'EGP' }) }
                            </Col>
                        </Row>
                    )}
                >
                    <Column
                        title={t("accounts.fields.date") as any}
                        dataIndex="date"
                        key="alpha"
                    />
                    {/* <Column<ITransaction["debit_accounts"]>
                        // title={t("transactions.fields.debit_account") as any}
                        title={() => 
                            <Row justify={"space-between"} gutter={8}>
                                <Col span={24}>
                                    <Row justify={"center"}>
                                        <Typography.Text>
                                            {t("transactions.fields.debit_account")}
                                        </Typography.Text>
                                    </Row>
                                    <Row justify={"space-between"} gutter={8}>
                                        <Col span={16}>
                                            <Typography.Text>
                                                {"Name"}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={8}>
                                            <Typography.Text>
                                                {"Amount"}
                                            </Typography.Text>
                                        </Col>
                                    </Row>

                                </Col>
                            </Row>
                        }
                        dataIndex={['debit_accounts']}
                        key="romeo"
                        render={(value) => 
                            <>
                            {
                                value.map((account, idx) => (
                                    <Row key={idx} justify={"space-between"} gutter={8}>
                                        <Col span={16}>
                                            <Typography.Text>
                                                {account.name}
                                            </Typography.Text>
                                        </Col>
                                        <Col span={8}>
                                            <Typography.Text>
                                                {account.pivot.amount.toLocaleString('en-US', {style: 'currency', currency: 'EGP' })}
                                            </Typography.Text>
                                        </Col>
                                    </Row>
                                ))
                            }
                            </>
                        }
                    /> */}
                    <Column
                        title={t("transactions.transactions") as any}
                        dataIndex={["code"]}
                        key="crtrans"
                        render={(value) =>
                            <Link 
                                to= {showUrl("transactions", value)}
                                 >
                                    {value}
                                 </Link>

                        }
                    />
                    <Column
                        title={t("transactions.fields.amount") as any}
                        dataIndex={["crtrans","amount"]}
                        key="what"
                    />
                </Table>
            </Col>
        </Row>

    )

}
