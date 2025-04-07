import React from "react";
import {
  pickNotDeprecated,
  useActiveAuthProvider,
  useGetIdentity,
} from "@refinedev/core";
import { Layout as AntdLayout, Typography, Avatar, Space, theme } from "antd";
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { IIdentity } from "@/interfaces";

export const ThemedHeaderV2: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  isSticky,
  sticky,
}) => {
  const { token } = theme.useToken();

  const authProvider = useActiveAuthProvider();
  const { data: identity } = useGetIdentity<IIdentity>();
console.log(identity)
  const shouldRenderHeader = identity?.organization && (identity?.organization.logo || identity?.user.name);

  if (!shouldRenderHeader) {
    return null;
  }

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (pickNotDeprecated(sticky, isSticky)) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        <Space size="middle">
          {identity.user?.name && <Typography.Text strong>{identity.user.name}</Typography.Text>}
          {identity.organization?.logo && <Avatar src={`/${identity.organization?.logo}`} alt={identity.user?.name} />}
        </Space>
      </Space>
    </AntdLayout.Header>
  );
};
