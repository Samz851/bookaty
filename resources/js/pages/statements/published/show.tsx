import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { usePDF } from 'react-to-pdf';

import { Button, Flex, Grid, Typography } from "antd";
import { ICompany, IContact, IReport, IStatement } from "@/interfaces";
import {
    CardWithContent,
    CustomerInfoList,
    CustomerInfoSummary,
    CustomerOrderHistory,
    Drawer,
} from "@/components";
import { useEffect, useState } from "react";
import { StatementEditor } from "../components/CKEditor/StatementEditor";
import { Show } from "@refinedev/antd";

export const StatemenReporttShow: React.FC<IResourceComponentsProps> = () => {
    const { list } = useNavigation();
    const back = useBack();
    const breakpoint = Grid.useBreakpoint();
    const { query } = useShow<IReport>();
    const [ content, setContent] = useState('');
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});
    const { data, isLoading } = query;
    const record = data?.data;
    const Content = record?.content;
    // const company = data?.data;

    useEffect(()=>{
        console.log(query, data);

    },[query])
    return (
        <Show
            isLoading ={isLoading}
            headerButtons={({ defaultButtons }) => (
                <>
                  {defaultButtons}
                  <Button type="primary" onClick={() => toPDF()}>Custom Button</Button>
                </>
              )}

        >
            <Typography.Title>
                {record?.title}
            </Typography.Title>
            {/* <CompanyView company={company} /> */}
            <div dangerouslySetInnerHTML={{ __html: Content as any }} ref={targetRef} />
        </Show>
    );
};
