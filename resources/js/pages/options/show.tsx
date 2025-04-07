import { OptionsOutletContextType, IOptions } from "@/interfaces"
import { Show } from "@refinedev/antd";
import { BaseKey, useGetIdentity, useShow } from "@refinedev/core"
import { useEffect } from "react";
import { useLoaderData, useOutletContext } from "react-router-dom";

export const ShowOptions = () => {
    // const id: BaseKey = useLoaderData() as BaseKey;

    const { queryResult} = useShow<IOptions>({
        resource: "options",
    });
    const { data, isLoading } = queryResult;
    const record = data?.data;

    // useEffect(()=>{
    //     if (identity?.organization?.options.id !== undefined && identity?.organization?.options.id > 0 ) setShowId(identity?.organization?.options.id)
    //   },[identity]);

    return (
        <Show
            isLoading={isLoading}
            canEdit={true}
            dataProviderName="laravel"
        >
            <div>Fiscal Cycle: {record?.fiscal_cycle}</div>
            <div>Fiscal Year Start: {record?.fiscal_year_start.toString()}</div>
        </Show>
    )
}