import {
    useShow,
    IResourceComponentsProps,
    useNavigation,
    useBack,
} from "@refinedev/core";
import { Flex, Grid } from "antd";
import { IFormula } from "@/interfaces";
import { CardWithContent, Drawer } from "@/components";

export const FormulaShow: React.FC<IResourceComponentsProps> = () => {
    const back = useBack();
    const { list } = useNavigation();
    const breakpoint = Grid.useBreakpoint();
    const { queryResult } = useShow<IFormula>();

    const { data } = queryResult;
    const formula = data?.data;
    return (
        <Drawer
            open
            onClose={() => back()}
            width={breakpoint.sm ? "736px" : "100%"}
        >
            <Flex
                vertical
                gap={32}
                style={{
                    padding: "32px",
                }}
            >
                <CardWithContent title={formula?.name}>
                    <p>Formula: {formula?.formula}</p>
                    <p>
                        Description: {formula?.description}
                    </p>
                    <p>code: {formula?.code}</p>
                </CardWithContent>

            </Flex>
        </Drawer>
    );
};
