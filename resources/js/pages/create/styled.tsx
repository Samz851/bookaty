import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
    wrapper: {
        backgroundColor: "white",
        borderRadius: "0px",
        boxShadow:  "20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff",
        padding: "24px",

        ".ant-list-header": {
            // display: "flex",
            // justifyContent: "flex-end",
            // alignItems: "center"
        },
        ".acc-link" : {
            padding: "15px",
            background: 'aliceblue',
            boxShadow: '2px 2px 2px grey',
        },
        ".acc-link.current": {
            background: '#deecf9',
        }
        
    },

    errorBorder: {
        border: "1px solid red",
        borderRadius: "5px"
    }
}))