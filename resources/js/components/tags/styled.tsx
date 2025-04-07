import { createStyles } from "antd-style";

export const useStyles = createStyles(({token}) => {
    return {
        tagInput : {
            // width: '100%',
            marginInlineEnd: 8,
            verticalAlign: 'top',
        },
        tagPlus : {
            height: 22,
            background: token.colorBgContainer,
            borderStyle: 'dashed',
          }
    }
});
