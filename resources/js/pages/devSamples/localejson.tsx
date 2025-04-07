import enStrings from '@/locales/ar_sa.json';
import JsonView from '@uiw/react-json-view';
import JsonViewEditor from '@uiw/react-json-view/editor';
import type { TransferProps } from 'antd';
import { Button, Space, Transfer } from 'antd';
import { useEffect, useState } from 'react';

interface RecordType {
    key: string;
    title: string;
}

const pagesOptions: RecordType[] = [...Object.keys(enStrings).map(p => ({key: p, title: p}))];

export const LocaleJsonEditor = () => {
    // const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>(pagesOptions.map(p => p.key));
    const [selectedPagesKeys, setSelectedPagesKeys] = useState<TransferProps['targetKeys']>(['statements', 'branches', 'contacts', 'companies', 'pages', 'actions', 'buttons']);

    const [ pages, setPages ] = useState<RecordType[]>(pagesOptions);

    const [ jsonViewPages, setJsonViewPages ] = useState<any>({...enStrings});
    // useEffect(() => {
    //     if ( targetKeys?.length === 0 ) {
    //         setTargetKeys([...pagesOptions.map(p => p.key)]);
    //     }
    // }, [])
    // console.log(targetKeys, pages, pagesOptions);
    const onTransferComplete = (targetKeys, direction, moveKeys) => {
        // console.log(targetKeys, direction, moveKeys);
        setSelectedPagesKeys(targetKeys);
    }

    // const RenderView

    useEffect(()=>{
        console.log('pagesChanged', jsonViewPages);
    }, [jsonViewPages]);
    const fetchPages = () => {
        const entries = Object.entries(jsonViewPages);
        console.log('entries', entries);
        const filteredEntries = entries.filter(entry => {
            console.log(entry, selectedPagesKeys?.includes(entry[0]));
            return selectedPagesKeys?.includes(entry[0]);
        }
        );
        console.log('filtered entries', filteredEntries);
        const newPages = Object.fromEntries(filteredEntries);
        console.log('new pages', newPages);
        // console.log('original', jsonViewPages);
        setJsonViewPages({...newPages});
        // console.log(filtered))
    }
    return (


        <>
            <Transfer
                dataSource={pages}
                targetKeys={selectedPagesKeys}
                render={(item) => item.title}
                titles={['Source', 'Target']}
                oneWay
                onChange={onTransferComplete}
                />
                <Button onClick={() => fetchPages()}>{"Fetch"}</Button>
            {/* {
                selectedPages.map( page => {
                    return (
                        <Button>{page}</Button>
                    )
                })
            } */}
            <Space/>
        <JsonView
        value={jsonViewPages}
        displayDataTypes={false}
        // editable={true}
        // onEdit={(options) => {
        //     console.log(options);
        // }}
         />
        </>
    )
}