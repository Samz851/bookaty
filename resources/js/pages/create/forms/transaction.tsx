import { useLocation, useOutletContext, useSearchParams } from "react-router-dom";

import { Create, useForm, useModalForm, useSelect } from "@refinedev/antd";
import dayjs from "dayjs";
import {
    HttpError, useBack, useGetToPath,
    useGo,
    useNavigation,
    useParse,
    useParsed,
    useTranslate
} from "@refinedev/core";

import {
    LeftOutlined, MinusCircleOutlined, PlusOutlined
} from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker,
    Divider,
    Form, Input,
    InputNumber,
    Modal,
    Row,
    Select, Space, Switch, Typography
} from "antd";

import { CreateContextType, CreateFormPropsType, IAccount, ITax, ITransaction } from "@/interfaces";

import { useEffect, useMemo, useState } from "react";
import { useStyles } from "../styled";
import { debounce } from "lodash";

type Props = {
    isOverModal?: boolean;
};

type Accounts = {
    id: number;
    amount: number;
}
type FormValues = {
    date: string;
    name: string;
    description: string;
    amount: number;
    debit_accounts: Array<Accounts>;
    credit_accounts: Array<Accounts>;
    notes_pr?: number;
    issue_payment: boolean;
    tax_id: number;
};
type totalAccounts = {
    [key: number]: number;
}

export const TransactionCreateForm = () => {
    const [ pagination, setPagination ] = useState({
        current: 1,
        pageSize: 20
    })
    const { key } = useLocation();
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const go = useGo();
    const back = useBack();
    const { create } = useNavigation();
    const [ createForms, goToCreateForm, openForms, setOpenForms ] = useOutletContext<CreateContextType>();
    const t = useTranslate();
    const [ totalDebit, setTotalDebit ] = useState<totalAccounts>({});
    const [ totalCredit, setTotalCredit ] = useState<totalAccounts>({});
    const [ accountsBalanceError, setAccountsBalanceError ] = useState(false)
    const [ selectedDebitAccount, setSelectedDebitAccount ] = useState<number>(0);

    const { resource } = useParsed();

    const { form, formProps, onFinish, formLoading, saveButtonProps } = useForm<ITransaction, HttpError, FormValues
    >({
        action: "create",
        resource: "transactions",
    });
    // useEffect(() => {
    //     if ( ! formLoading ) {
    //         addFormStep({v: "one"})
    //     }
    // }, [formLoading])
    const { styles } = useStyles();

    const { 
        selectProps: AccountselectProps,
     } = useSelect<IAccount>({
        resource: "accounts",
        optionLabel: "code_label" as any,
        optionValue: "id" as any,
        searchField: "code_label" as any,
        debounce: 800,
        queryOptions: {
            keepPreviousData: true
        },
        onSearch: (value) => [{
            field: 'code_label',
            operator: 'contains',
            value: value
        }],
        filters: [
            {
            field: "taxonomy",
            operator: "eq",
            value: "leaf"
            },
            {
            field: "type",
            operator: "eq",
            value: 'account'
            }
        ],
        pagination: {
            mode: 'off'
        }
    });
    // console.log(AccountselectProps);

    const [ accountsOptions, setAccountsOptions ] = useState<any[]>([]);

    const { selectProps: taxesSelectProps } = useSelect<ITax>({
        resource: "taxes",
        optionLabel: "name",
        optionValue: "id"
    })

    const removeAccount = (key, type, name, cb) => {
        if ( type === 'credit' ) {
            const newTotal = {...totalCredit};
            delete newTotal[key];
            setTotalCredit({...newTotal}) 
        } else {
            const newTotal = {...totalDebit};
            delete newTotal[key];
            setTotalDebit({...newTotal}) 
        }
        cb(name);

    }

    const filterOption = (input, option) => {
        return option.label.toLowerCase().includes(input.toLowerCase());
    }
    
    // const handleEndScroll = useMemo(
    //     () =>
    //       debounce(() => {
    //         setPagination({...pagination, current: pagination.current+1})
    //         // console.log("END SCROLL")
    //     }, 1000),
    //     []
    //   );
    useEffect(() => {
        // console.log('forms', createForms, key);
        const prevForm = createForms.find( (form) => form.key === key );
        if ( prevForm ) {
            form.setFieldsValue( prevForm.values || {});
        } else {
            // setOpenForms([...openForms, `transactions - ${key}`]);
        }
        // console.log(formProps)
    }, [])

    useEffect(() => {
        // setAccountsOptions([...accountsOptions, ...AccountselectProps.options as any])
        console.log(AccountselectProps.options, accountsOptions);
    }, [AccountselectProps])

    return (
        <Create saveButtonProps={saveButtonProps}>
        <Form
            {...formProps}
            form={form}
            onFinish={async (values) => {
                const totalDebitAmount = Object.values(totalDebit).reduce((acc, cur) => acc + cur, 0);
                const totalCreditAmount = Object.values(totalCredit).reduce((acc, cur) => acc + cur, 0)
                console.log(totalCreditAmount, totalDebitAmount);
                if (totalDebitAmount !== totalCreditAmount) {
                    setAccountsBalanceError(true);
                    form.setFields([
                        {
                            name: ['credit_accounts'],
                            errors: ["Accounts not balanced"]
                        },
                        {
                            name: ['debit_accounts'],
                            errors: ["Accounts not balanced"]
                        }
                    ])
                } else {
                    try {
                        const data = await onFinish({
                            date: values.date.toString(),
                            name: values.name,
                            description: values.description,
                            amount: totalDebitAmount,
                            debit_accounts: values.debit_accounts,
                            credit_accounts: values.credit_accounts,
                            notes_pr: values.notes_pr,
                            issue_payment: values.issue_payment,
                            tax_id: values.tax_id
                        });

                        back();

                    } catch (error) {
                        Promise.reject(error);
                    }
                }
            }}
        >
            <Row justify={"space-between"} align={"middle"} gutter={18}>
                <Col span={16}>
                    <Form.Item
                        label={t("transactions.fields.name")}
                        name="name"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={t("transactions.fields.description")}
                        name="description"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={t("transactions.fields.date")}
                        name="date"
                        rules={[{required: true}]}
                        initialValue={dayjs()}
                    >
                        <DatePicker minDate={dayjs()}/>
                    </Form.Item>
                </Col>
            </Row>
            <Divider />
            <Row justify={"space-around"} gutter={8} style={{border: "1px solid black"}}>
                <Col span={12} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                    <Row justify={"center"}>
                        <Typography.Title level={5}>
                            {t("transactions.form.debit")}
                        </Typography.Title>
                    </Row>
                    <Row>
                        <Col span={2} />
                        <Col span={16} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                            <Typography.Text>
                                {t("accounts.accounts")}
                            </Typography.Text>
                        </Col>
                        <Col span={6}>
                            <Typography.Text>
                                {t("transactions.fields.amount")}
                            </Typography.Text>
                        </Col>
                    </Row>
                    <Form.List
                        name="debit_accounts"
                        rules={[
                            {
                            validator: async (_, debit_accounts) => {
                                if (!debit_accounts || debit_accounts.length < 1) {
                                return Promise.reject(new Error('At least 1 Debit account'));
                                }
                            },
                            },
                        ]}
                    >
                        {(fields, {add, remove}, {errors}) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} align={"stretch"}>
                                        <Col span={2}>
                                            <MinusCircleOutlined onClick={() => removeAccount(key, 'debit', name, remove)} />
                                        </Col>
                                        <Col span={16} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                                            <Form.Item
                                                name={[name, 'id']}
                                                rules={[{required: true}]}
                                                validateStatus={accountsBalanceError as any}
                                                        >
                                                <Select
                                                {...AccountselectProps}
                                                    size="small"
                                                    showSearch
                                                    optionFilterProp="code"
                                                    style={{ width: 300 }}
                                                    onChange={value => setSelectedDebitAccount(value as any)}
                                                    filterOption={filterOption}
                                                    // onPopupScroll={(e) => {
                                                        
                                                    //     // console.log(e.currentTarget.scrollTop, e.currentTarget.scrollHeight, e.currentTarget);
                                                    //     handleEndScroll();
                                                    // }}
                                                    options={AccountselectProps.options}
                                                    dropdownRender={(menu) => (
                                                        <>
                                                        {menu}
                                                        <Divider style={{ margin: '8px 0' }} />
                                                        <Space style={{ padding: '0 8px 4px' }}>
                                                            <Button type="text" icon={<PlusOutlined />} onClick={() => goToCreateForm(form.getFieldsValue(true), 'accounts')}>
                                                            Add item
                                                            </Button>
                                                        </Space>
                                                        </>
                                                    )}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                name={[name, "amount"]}
                                                rules={[{ required: true }]}
                                                validateStatus={accountsBalanceError as any}
                                            >
                                                <InputNumber
                                                    size="small"
                                                    precision={2}
                                                    onBlur={(e) => setTotalDebit({...totalDebit, [key]: parseInt(e.target.value)})}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        {t("transactions.form.add_debit")}
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Col>
                <Col span={12} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                    <Row justify={"center"}>
                        <Typography.Title level={5}>
                            {t("transactions.form.credit")}
                        </Typography.Title>
                    </Row>
                    <Row>
                        <Col span={2} />
                        <Col span={16} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                            <Typography.Text>
                                {t("accounts.accounts")}
                            </Typography.Text>
                        </Col>
                        <Col span={6}>
                            <Typography.Text>
                                {t("transactions.fields.amount")}
                            </Typography.Text>
                        </Col>
                    </Row>
                    <Form.List
                        name="credit_accounts"
                        rules={[
                            {
                            validator: async (_, credit_accounts) => {
                                if (!credit_accounts || credit_accounts.length < 1) {
                                return Promise.reject(new Error('At least 1 Credit account'));
                                }
                            },
                            },
                        ]}
                    >
                        {(fields, {add, remove}, {errors}) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Row key={key} align={"stretch"}>
                                        <Col span={2}>
                                            <MinusCircleOutlined onClick={() => removeAccount(key, 'credit', name, remove)} />
                                        </Col>
                                        <Col span={16} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                                            <Form.Item
                                                // label={t("transactions.fields.debit_account")}
                                                name={[name, 'id']}
                                                rules={[{required: true}]}
                                                validateStatus={accountsBalanceError as any}
                                                        >
                                                <Select
                                                    size="small"
                                                    style={{ width: 300 }}
                                                    onChange={value => setSelectedDebitAccount(value)}
                                                    filterOption={true}
                                                    options={AccountselectProps.options}
                                                    dropdownRender={(menu) => (
                                                        <>
                                                        {menu}
                                                        <Divider style={{ margin: '8px 0' }} />
                                                        <Space style={{ padding: '0 8px 4px' }}>
                                                            <Button type="text" icon={<PlusOutlined />} onClick={() => create('accounts', 'push')}>
                                                            Add item
                                                            </Button>
                                                        </Space>
                                                        </>
                                                    )}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={6}>
                                            <Form.Item
                                                // label={t("transactions.fields.amount")}
                                                name={[name, "amount"]}
                                                rules={[{ required: true }]}
                                                validateStatus={accountsBalanceError as any}
                                            >
                                                <InputNumber 
                                                    size="small" 
                                                    precision={2}
                                                    onBlur={(e) => setTotalCredit( {...totalCredit, [key]: parseInt(e.target.value)})}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ))}
                                <Form.Item>
                                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                        {t("transactions.form.add_credit")}
                                    </Button>
                                    <Form.ErrorList errors={errors} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Col>
                <Col span={24} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                    <Row justify={"space-around"} gutter={8} style={{minHeight: '50px'}}>
                        <Col span={12} style={{textAlign: "center", borderRight: "1px solid grey"}}>
                            <Row justify={"end"}>
                                <Col span={6} style={{textAlign: "center", borderLeft: "1px solid grey"}}>
                                    <Typography.Title level={5} className={accountsBalanceError ? styles.errorBorder : ''}>
                                        {Object.values(totalDebit).reduce((acc, cur) => acc + cur, 0)}
                                    </Typography.Title>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12} style={{textAlign: "center"}}>
                            <Row justify={"end"}>
                                <Col span={6} style={{textAlign: "center", borderLeft: "1px solid grey"}}>
                                    <Typography.Title level={5} className={accountsBalanceError ? styles.errorBorder : ''}>
                                        {Object.values(totalCredit).reduce((acc, cur) => acc + cur, 0)}
                                    </Typography.Title>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Divider />
            <Row justify={"space-between"} align={"middle"} gutter={18}>
                <Col span={16}>
                    <Form.Item
                        label={t("transactions.fields.notes_pr")}
                        name="notes_pr"
                    >
                        <Select
                            style={{ width: 300 }}
                            filterOption={true}
                            options={AccountselectProps.options}
                        />
                    </Form.Item>
                    <Form.Item
                        label={t("transactions.fields.tax")}
                        name="tax_id"
                        rules={[{required: true}]}
                    >
                        <Select
                            style={{ width: 300 }}
                            options={taxesSelectProps.options}
                            dropdownRender={(menu) => (
                                <>
                                {menu}
                                <Divider style={{ margin: '8px 0' }} />
                                <Space style={{ padding: '0 8px 4px' }}>
                                    <Button type="text" icon={<PlusOutlined />} onClick={() => goToCreateForm(form.getFieldsValue(true), 'taxes')}>
                                    Add item
                                    </Button>
                                </Space>
                                </>
                            )}
                            // {...taxesSelectProps}
                        />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label={t("transactions.fields.issue_payment")}
                        name="issue_payment"
                    >
                        <Switch />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        </Create>
    )

}