import { CardWithContent } from "@/components";
import { RandomAvatar } from "@/components/avatar";
import { ITax } from "@/interfaces";
import { Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";

type Props = {
    tax?: ITax;
};

export const TaxView = ({tax}: Props) => {
    const { t } = useTranslation();
    // const { back } = useBack();

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
                    <div>
                        <Typography.Title>
                            {tax?.name}
                        </Typography.Title>
                    </div>
                    <div>
                        <Typography.Text type="secondary">
                        % {tax?.rate && (tax?.rate * 100).toFixed(2)}
                        </Typography.Text>
                    </div>
                </Flex>
            </Flex>
            <CardWithContent title={t('taxes.fields.total_collected')}>
                <Flex vertical>
                    <div>
                        <Typography.Text>
                            {tax?.total}
                        </Typography.Text>
                    </div>
                </Flex>
            </CardWithContent>
        </Flex>
    )
}
