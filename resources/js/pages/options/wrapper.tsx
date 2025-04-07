import { IIdentity, IOptions } from "@/interfaces"
import { useGetIdentity, useList } from "@refinedev/core"
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { OptionsOutletContextType } from '../../interfaces/index';
import { resources } from '../../config/resources';

export const OptionsWrapper = () => {
    const { data: identity } = useGetIdentity<IIdentity>();

    const [ context, setContext ] = useState<OptionsOutletContextType>({loading: true})
    const [ loading, setLoading] = useState(true);
    const [ id, setId ] = useState<number | undefined>();
    const [ action, setAction ] = useState('edit');

    useEffect(()=>{
        if (identity?.options.id !== undefined && identity?.options.id !== 0 ) {
            setContext({
                loading: false,
                resource: 'options',
                id: identity?.options.id as number,
                action: identity?.organization.onboarded === 0 ? 'edit' : 'show'
            })
        }
    },[identity]);

    return (
        <div>
            <Outlet context={context} />
        </div>
    )
}