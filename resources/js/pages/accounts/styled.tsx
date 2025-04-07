import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => {
    return {
        expanded: {
            ".leaf": {
                // boxShadow: "rgba(0, 0, 0, 0.35) 0px -50px 10px -28px inset"
            },
            ".expanded_row_odd": {
                backgroundColor: "#9c9898"
            },
            ".expanded_row_even": {
                backgroundColor: "#ababab"
            }
        }
    }
})
