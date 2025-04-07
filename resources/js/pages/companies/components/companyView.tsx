import { CardWithContent } from "@/components";
import { RandomAvatar } from "@/components/avatar";
import { ICompany } from "@/interfaces";
import { useNavigation } from "@refinedev/core";
import { Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    company?: ICompany;
};

export const CompanyView = ({company}: Props) => {
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
                    <Typography.Text type="secondary">
                        #{company?.id}
                    </Typography.Text>
                    <Typography.Title
                        level={3}
                        style={{
                            margin: 0,
                        }}
                    >
                        {company?.company_name}
                    </Typography.Title>
                </Flex>
            </Flex>
            <CardWithContent title={t('companies.fields.address')}>
                <Typography.Text>
                    {company?.address}
                </Typography.Text>
                <Typography.Text>
                    {company?.contact_information}
                </Typography.Text>
            </CardWithContent>
            <CardWithContent title={t('companies.fields.contacts')}>
                {
                    company?.contacts?.map(contact => (
                        <Flex vertical key={contact.id}>
                            <Typography.Link
                                strong
                                onClick={() => show('contacts', contact.id, 'push')}
                                style={{
                                    whiteSpace: "nowrap",
                                    color: token.colorTextHeading,
                                }}
                            >
                                {contact.name}
                            </Typography.Link>
                        </Flex>

                    ))
                }
            </CardWithContent>
        </Flex>
    )
}
