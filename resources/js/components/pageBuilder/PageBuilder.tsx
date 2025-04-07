import { Col, Divider, Flex, Grid, Row } from "antd"
import { PageBuilderComponents } from "./components"
import { PageBuilderOutline } from "./outline";
import { Puck, usePuck } from "@measured/puck"
import { PageBuilderFields } from "./fields"
import { PageBuilderPreview } from "./preview";
import { PageBuilderHeader } from "./header";
import { useStyles } from "./styled";

export const PageBuilderComponent = ({config, data, onPublish}) => {
    const appData = usePuck();
    console.log('puck', appData);
    const { styles } = useStyles();
    return (
        // <Row>
            <Puck
                config={config}
                data={data}
                onPublish={onPublish}
                // headerTitle='Page' 
                overrides={{
                    // header: PageBuilderHeader,
                    puck: (children: any) => {
                        console.log(children)
                        const header = children.children?.props.children[0];
                        return (
                            <Row>
                            <Col span={24}>
                                <PageBuilderHeader {...header.props} />
                            </Col>
                            <Col span={4}>
                                <Row>
                                <PageBuilderComponents />
                                </Row>
                                <Divider />
                                <Row>
                                    <PageBuilderFields />
                                </Row>
                                <Divider />
                                <Row>
                                    <PageBuilderOutline />
                                </Row>
                            </Col>
                            <Col span={20} className={styles.preview}>
                                <PageBuilderPreview />
                            </Col>
                        </Row>
                        )
                    }
                }}
            >

            </Puck>
        // </Row>
    )
}