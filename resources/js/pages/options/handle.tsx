import { OptionsOutletContextType } from "@/interfaces";
import { useGetToPath, useGo, useNavigation } from "@refinedev/core";
import { useEffect } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom"

export const HandleOptionsView = () => {
    const go = useGo();
    const { editUrl, showUrl } = useNavigation();
    const { action, loading, resource, id } = useOutletContext<OptionsOutletContextType>();
    const getToPath = useGetToPath();
    // const toUrl = action === 'edit' ? editUrl(resource as any, id as any) : showUrl(resource as any, id as any);
    // const url = getToPath(
    //     {
    //         action: action as any,
    //         resource: resource as any,
    //         meta: {
    //             id: id,
    //         }
    //     }
    // )
    useEffect(() => {
        if ( ! loading && resource !== undefined ) {
            go({
                to: action === 'edit' ? editUrl(resource as any, id as any) : showUrl(resource as any, id as any),
                type: "push",
            });
        }
    }, [loading, resource]);

    console.log(action, loading, resource, id )
    return (null)

}