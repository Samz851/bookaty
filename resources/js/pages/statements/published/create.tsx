import { useLocation, useSearchParams } from "react-router-dom";

import { useForm, Edit, useSelect, List, useThemedLayoutContext, Create } from "@refinedev/antd";
import {
    CreateResponse,
    HttpError,
    useCreateMany,
    useGetToPath,
    useGo,
    useTranslate,
    useResourceParams
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { useAccountTypesSelect } from "@/hooks/useAccountTypesSelect";
import { useAccountsSelect } from "@/hooks/useAccountsSelect";
import { useState, useEffect } from "react";
import { IStatement, IReport } from "@/interfaces";
import { Config, Puck, usePuck } from "@measured/puck";
import "@/components/pageBuilder/puck.css";
import { DatePicker, Flex, Form, Input } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useStyles } from "../styled";
import { DrawerItems, EditorConfig, PageBuilderComponent, PageBuilderComponents, PageBuilderDrawer, PageBuilderFields, PageBuilderOutline, PageBuilderPreview, SampleConfig } from "@/components";
import { StatementBuilder } from "../builder";
import { StatementEditor } from "../components/CKEditor/StatementEditor";
import dayjs, { Dayjs } from "dayjs";


type FormValues = {
    title: string;
    content: string;
    cycle?: Dayjs[] | undefined;
    from?: string | undefined;
    to?: string | undefined;
    template_id?: any;
}

export const ReportCreatePage = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const go = useGo();
    const t = useTranslate();
    const [ content, setContent ] = useState('');
    const [ selectedCreditAccount, setSelectedCreditAccount ] = useState<number>(0);
    const [ selectedDebitAccount, setSelectedDebitAccount ] = useState<number>(0);
    const { styles } = useStyles();
    const { id } = useResourceParams();
    // const { form, formProps, formLoading, saveButtonProps } = useForm<IStatement, HttpError, FormValues
    // >({
    //     action: "clone",
    //     warnWhenUnsavedChanges: true,
    //     resource: "statements",
    //     redirect: false,
    // });

    const { form, formProps, formLoading, onFinish } = useForm<IReport, HttpError, FormValues>({
        action: "edit",
        warnWhenUnsavedChanges: true,
        resource: "reports",
        redirect: false,
    })
    // const { form } = formProps;
    // const statement = Form.useWatch('statement', form)
    const {
        mobileSiderOpen,
        setMobileSiderOpen,
        siderCollapsed,
        setSiderCollapsed,
    } = useThemedLayoutContext();

    useEffect(() => {
        console.log(formProps);
        setContent(formProps?.initialValues?.content as any);
    },[formProps]);

    useEffect(() => {
        setMobileSiderOpen(false);
        setSiderCollapsed(true);
    },[]);

    useEffect(()=>{
        form.setFieldsValue({
            content: content
        })
    }, [content]);

    const defaultData = {
        content: [],
        root: {},
    }

    const Header = ({ actions, children }) => {
        // console.log('Header', actions, children);

        return (
            <>
                {actions}
                {children}
            </>
        )
    }

    const JSONRenderer = () => {
        const { appState } = usePuck();
       
        return <div>{JSON.stringify(appState.data)}</div>;
    };

    // const drawerChildren: IDrawerItemObject[] = DrawerItems.map((item, i) => {
    //     return {
    //         name: item.name,
    //         index: i,
    //         children: item.children
    //     }
    // });

    // console.log('config', SampleConfig)
    return (
        <Create >

        
        <Form
            {...formProps}
            layout="vertical"
            onFinish={async (values) => {
                console.log(values);
                try {
                    // const data = await onFinish({
                    //     title: values.title,
                    //     content: values.content,
                    //     from: values.cycle?.[0]?.format('YYYY/MM/DD').toString() || '',
                    //     to: values.cycle?.[1]?.format('YYYY/MM/DD').toString() || '',
                    //     template_id: id
                    // });
                    // close();
                    // go({
                    //     to:
                    //         searchParams.get("to") ??
                    //         getToPath({
                    //             action: "list",
                    //         }) ??
                    //         "",
                    //     query: {
                    //         to: undefined,
                    //     },
                    //     options: {
                    //         keepQuery: true,
                    //     },
                    //     type: "replace",
                    // });

                } catch (error) {
                    Promise.reject(error);
                }
            }}
            >
                <Form.Item
                    label="cycle"
                    name="cycle"
                    rules={[{ required: true }]}
                >
                    <DatePicker.RangePicker/>
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true }]}
                >
                    <Input placeholder="Title" />
                </Form.Item>
                <Form.Item
                    label="Content"
                    name="content"
                    rules={[{required: true}]}
                >
                <StatementEditor content={content} setContent={setContent} />

                </Form.Item>
            </Form>
            {/* <PageBuilderComponent 
                config={SampleConfig} 
                data={defaultData}
                // overrides={{
                //     header: Header
                // }}
                onPublish={(data) => console.log(data)} 
            >
            </PageBuilderComponent> */}
        </Create>

    );
};
