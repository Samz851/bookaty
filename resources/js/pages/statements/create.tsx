import { useLocation, useSearchParams } from "react-router-dom";

import { useForm, Edit, useSelect, List, useThemedLayoutContext, Create } from "@refinedev/antd";
import {
    CreateResponse,
    HttpError,
    useCreateMany,
    useGetToPath,
    useGo,
    useTranslate
} from "@refinedev/core";
// import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import { useAccountTypesSelect } from "@/hooks/useAccountTypesSelect";
import { useAccountsSelect } from "@/hooks/useAccountsSelect";
import { useState, useEffect } from "react";
import { IStatement } from "@/interfaces";
import { Config, Puck, usePuck } from "@measured/puck";
import "@/components/pageBuilder/puck.css";
import { Flex, Form, Input } from "antd";
import { PageContainer } from "@ant-design/pro-layout";
import { useStyles } from "./styled";
import { DrawerItems, EditorConfig, PageBuilderComponent, PageBuilderComponents, PageBuilderDrawer, PageBuilderFields, PageBuilderOutline, PageBuilderPreview, SampleConfig } from "@/components";
import { StatementBuilder } from "./builder";
import { StatementEditor } from "./components/CKEditor/StatementEditor";


type FormValues = {
    title: string;
    content: string;
}

export const StatementCreatePage = () => {
    const getToPath = useGetToPath();
    const [searchParams] = useSearchParams();
    const { pathname } = useLocation();
    const go = useGo();
    const t = useTranslate();
    const [ content, setContent ] = useState('');
    const [ selectedCreditAccount, setSelectedCreditAccount ] = useState<number>(0);
    const [ selectedDebitAccount, setSelectedDebitAccount ] = useState<number>(0);
    const { styles } = useStyles();
    const { form, formProps, onFinish, formLoading, saveButtonProps } = useForm<IStatement, HttpError, FormValues
    >({
        action: "create",
        warnWhenUnsavedChanges: true,
        resource: "statements",
        redirect: false,
    });
    // const { form } = formProps;
    // const statement = Form.useWatch('statement', form)
    const {
        mobileSiderOpen,
        setMobileSiderOpen,
        siderCollapsed,
        setSiderCollapsed,
    } = useThemedLayoutContext();

    // useEffect(() => {
    //     console.log(formProps);
    //     console.log(statement)
    // },[formProps, statement]);

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
        <Create saveButtonProps={saveButtonProps}>

        
        <Form
            {...formProps}
            layout="vertical"
            onFinish={async (values) => {
                try {
                    const data = await onFinish({
                        title: values.title,
                        content: values.content
                    });
                    close();
                    go({
                        to:
                            searchParams.get("to") ??
                            getToPath({
                                action: "list",
                            }) ??
                            "",
                        query: {
                            to: undefined,
                        },
                        options: {
                            keepQuery: true,
                        },
                        type: "replace",
                    });

                } catch (error) {
                    Promise.reject(error);
                }
            }}
            >
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
