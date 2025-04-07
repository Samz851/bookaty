import {
    useShow,
    IResourceComponentsProps, useBack
} from "@refinedev/core";
import { Grid } from "antd";
import { ITax } from "@/interfaces";
import {
    Drawer
} from "@/components";
import { TaxView } from "./components/taxView";

export const TaxShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<ITax>();

    const { data } = queryResult;
    const tax = data?.data;

    return (
        <Drawer
            open
            onClose={() => back()}
            width={breakpoint.sm ? "736px" : "100%"}
        >
            <TaxView tax={tax} />
        </Drawer>
    );
};
