import { Layout, Modal } from "antd"
import { List } from "antd/es/form/Form";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { useEffect, useState } from "react"
import { SearchInput } from "../input";
import { ResultsTable } from "../results";
import { useApiUrl } from "@refinedev/core";
import { Request } from "@/helpers/httpHelper";

export const SearchModal = ({open, setOpen}) => {
    // const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const apiUrl = useApiUrl('laravel');
    const getData = async () => {
      if ( searchTerm.length > 1 ) {
        let url = `${apiUrl}/accounts/search`;
        let res = await Request('GET', url, null, {params:{code: searchTerm}});
        if ( res.data.success ) {
          setSearchResults([...res.data.result]);
        }
      }
    }

    // const toggleModal = () => {
    //     setOpen(!open);
    // };
    useEffect(()=>{
        console.log(searchTerm);
        getData()
    }, [searchTerm])

    return (
        <Modal
            open={open}
            onOk={()=>setOpen(!open)}
            onCancel={()=>setOpen(false)}
        >
            <Layout>
                <Header>
                    <SearchInput setSearchTerm={setSearchTerm}/>
                </Header>
                <Content>
                    <ResultsTable data={searchResults} />
                </Content>
                <Footer>Footer</Footer>
            </Layout>
        </Modal>
    )
}