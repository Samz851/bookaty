import React, { forwardRef } from "react";
import { MoreOutlined } from "@ant-design/icons";
import { useStyles } from "./styled";

type Props = {
    onClick?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
    style?: React.CSSProperties;
};

export const TableActionButton = forwardRef<any, any>(({ onClick }: Props, ref) => {
    const { styles } = useStyles();
    return (
        <MoreOutlined
            ref={ref}
            role="button"
            className={styles.button}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
        />
    );
});
