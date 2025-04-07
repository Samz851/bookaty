import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { Flex, Grid, Typography } from 'antd';
import { ICompany, IContact, IStatement } from "@/interfaces";
import {
    CardWithContent,
    CustomerInfoList,
    CustomerInfoSummary,
    CustomerOrderHistory,
    Drawer,
} from "@/components";
import { useEffect } from "react";
import { MarkdownField, Show, Title } from "@refinedev/antd";

export const StatementShow: React.FC<IResourceComponentsProps> = () => {
    const { list } = useNavigation();
    const back = useBack();
    const breakpoint = Grid.useBreakpoint();
    const { query } = useShow<IStatement>();
    const { data, isLoading } = query;
    const record = data?.data;
    const Content = record?.content;

    // const { data } = queryResult;
    // const company = data?.data;

    useEffect(()=>{
        console.log(query, data);

    },[query])
    return (
        <Show
            isLoading ={isLoading}

        >
            <Typography.Title>
                {record?.title}
            </Typography.Title>
            {/* <CompanyView company={company} /> */}
            <div dangerouslySetInnerHTML={{ __html: Content as any }} />
        </Show>
    );
};
