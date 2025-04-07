import {
    useShow,
    IResourceComponentsProps, useBack
} from "@refinedev/core";
import { Grid } from "antd";
import { ICompany } from "@/interfaces";
import {
    Drawer
} from "@/components";
import { CompanyView } from "./components/companyView";

export const CompanyShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<ICompany>();

    const { data } = queryResult;
    const company = data?.data;
    return (
        <Drawer
            open
            onClose={() => back()}
            width={breakpoint.sm ? "736px" : "100%"}
        >
            <CompanyView company={company} />
        </Drawer>
    );
};
