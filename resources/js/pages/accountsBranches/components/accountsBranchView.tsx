import { CardWithContent } from "@/components";
import { RandomAvatar } from "@/components/avatar";
import { IAccountsBranch } from "@/interfaces";
import { useNavigation } from "@refinedev/core";
import { Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    accountsBranch?: IAccountsBranch;
};

export const AccountsBranchView = ({accountsBranch}: Props) => {
    const { t } = useTranslation();
    const { show } = useNavigation();
    const { token } = theme.useToken();

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
                        #{accountsBranch?.id}
                    </Typography.Text>
                    <Typography.Title
                        level={3}
                        style={{
                            margin: 0,
                        }}
                    >
                        {accountsBranch?.name}
                    </Typography.Title>
                </Flex>
            </Flex>
            <CardWithContent title={t('branches.fields.description')}>
                <Typography.Text>
                    {accountsBranch?.description}
                </Typography.Text>
            </CardWithContent>
            {
                accountsBranch?.parent &&
                <CardWithContent title={t('branches.fields.parent')}>
                    <Typography.Link
                        strong
                        onClick={() => show('branches', accountsBranch.parent?.id || 0, 'push')}
                        style={{
                            whiteSpace: "nowrap",
                            color: token.colorTextHeading,
                        }}
                    >
                        {accountsBranch.parent?.name}
                    </Typography.Link>
                </CardWithContent>
            }
            {
                accountsBranch?.children &&
                <CardWithContent title={t('branches.fields.children')}>
                {
                    accountsBranch?.children?.map(branch => (
                        <Flex vertical key={branch.id}>
                            <Typography.Link
                                strong
                                onClick={() => show('branches', branch.id, 'push')}
                                style={{
                                    whiteSpace: "nowrap",
                                    color: token.colorTextHeading,
                                }}
                            >
                                {branch.name}
                            </Typography.Link>
                        </Flex>
                    ))
                }
                </CardWithContent>
            }
            <CardWithContent title={t('branches.fields.accounts')}>
            {
                accountsBranch?.accounts?.map(account => (
                    <Flex vertical key={account.id}>
                        <Typography.Link
                            strong
                            onClick={() => show('accounts', account.id, 'push')}
                            style={{
                                whiteSpace: "nowrap",
                                color: token.colorTextHeading,
                            }}
                        >
                            {account.name}
                        </Typography.Link>
                    </Flex>
                ))
            }
            </CardWithContent>
        </Flex>
    )
}
