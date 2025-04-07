import { CardWithContent } from "@/components";
import { RandomAvatar } from "@/components/avatar";
import { IAccount } from "@/interfaces";
import { Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    account?: IAccount;
};

export const AccountInfoView = ({account}: Props) => {
    const { t } = useTranslation();

    // const { data } = queryResult;
    // const company = data?.data;

    return (
        <Flex
            vertical
            gap={32}
            style={{
                padding: '32px',
            }}
        >
            <Flex align="center" gap={32}>
                <RandomAvatar />
                <Flex vertical>
                    <Typography.Text type="secondary">
                        #{account?.id}
                    </Typography.Text>
                    <Typography.Title
                        level={3}
                        style={{
                            margin: 0,
                        }}
                    >
                        {account?.name}
                    </Typography.Title>
                </Flex>
            </Flex>
            <CardWithContent title={t('accounts.fields.parent')}>
                <Typography.Text>
                    {account?.parent?.name}
                </Typography.Text>
            </CardWithContent>
        </Flex>
    )
}
