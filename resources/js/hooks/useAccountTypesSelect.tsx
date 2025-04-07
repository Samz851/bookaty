import { IAccountsBranch } from "@/interfaces";
import { useApiUrl, useCustom } from "@refinedev/core";

export const useAccountTypesSelect = () => {
    const apiUrl = useApiUrl("laravel");
    return useCustom<IAccountsBranch[]>({
        url: `${apiUrl}/branches`,
        method: "get",
        config: {
            query: {
                noChildren: true,
            }
        }
    })
}
