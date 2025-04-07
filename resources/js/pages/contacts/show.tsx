import {
    useShow,
    IResourceComponentsProps, useBack
} from "@refinedev/core";
import { Grid } from "antd";
import { IContact } from "@/interfaces";
import {
    Drawer
} from "@/components";
import { ContactView } from "./components/contactView";

export const ContactShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<IContact>();

    const { data } = queryResult;
    const contact = data?.data;

    return (
        <Drawer
            open
            onClose={() => back()}
            width={breakpoint.sm ? "736px" : "100%"}
        >
            <ContactView contact={contact} />
        </Drawer>
    );
};
