import { CardWithContent } from "@/components";
import { RandomAvatar } from "@/components/avatar";
import { IContact } from "@/interfaces";
import { useNavigation } from "@refinedev/core";
import { Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    contact?: IContact;
};

export const ContactView = ({contact}: Props) => {
    const { t } = useTranslation();
    const { show } = useNavigation();
    const { token } = theme.useToken();
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
                    <div>
                        <Typography.Title>
                            {contact?.company?.company_name}
                        </Typography.Title>
                    </div>
                    <div>
                        <Typography.Text type="secondary">
                            #{contact?.id}
                        </Typography.Text>
                    </div>
                    <div>
                        <Typography.Title
                            level={3}
                            style={{
                                margin: 0,
                            }}
                        >
                            {contact?.name}
                        </Typography.Title>
                    </div>
                </Flex>
            </Flex>
            <CardWithContent title={`${t('contacts.fields.email')} / ${t('contacts.fields.phone_number')}`}>
                <Flex vertical>
                    <div>
                        <Typography.Text>
                            {contact?.email}
                        </Typography.Text>
                    </div>
                    <div>
                        <Typography.Text>
                            {contact?.phone_number}
                        </Typography.Text>
                    </div>
                </Flex>
            </CardWithContent>
            <CardWithContent title={t('contacts.fields.accounts')}>
                {
                    contact?.accounts?.map(account => (
                        <Flex vertical key={account.id}>
                            <Typography.Link
                                strong
                                onClick={() => show('accounts', account.id, "push")}
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
