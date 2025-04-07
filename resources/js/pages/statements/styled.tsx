import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => {
    return {
        acPageContainer: {
            maxWidth: '100%',
            minWidth: '100%',
            ".ant-pro-page-container-children-container-no-header": {
                paddingBlockStart: "0px",
                paddingBlockEnd: "0px",
                paddingInline: "0px"
            },
            "._Puck-frame_17hk3_167": {
                backgroundColor: "rgba(255, 255, 255)",
            }
        }
    }
})
