import { IAccount } from "@/interfaces";
import { useApiUrl, useCustom } from "@refinedev/core";

export const useAccountsSelect = () => {
    const apiUrl = useApiUrl("laravel");
    return useCustom<IAccount[]>({
        url: `${apiUrl}/accounts`,
        method: "get",
        config: {
            query: {
                selectOptions: true,
            }
        }

    })
}
