import React, { useEffect, useMemo } from "react";
import { ThemedLayoutContextProvider } from "@refinedev/antd";
import { ThemedHeaderV2 as DefaultHeader } from "./header";
import { ThemedSiderV2 as DefaultSider } from "./sider";
import { Grid, Layout as AntdLayout, FloatButton, Modal, Input, List, Button } from "antd";
import type { RefineThemedLayoutV2Props } from "@refinedev/antd";
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { useApiUrl, useNavigation } from "@refinedev/core";
import { Request } from "@/helpers/httpHelper";
import { SearchModal } from "../accountSearch/model";

export const ThemedLayoutV2: React.FC<RefineThemedLayoutV2Props> = ({
  children,
  Header,
  Sider,
  Title,
  Footer,
  OffLayoutArea,
  initialSiderCollapsed,
}) => {
  const breakpoint = Grid.useBreakpoint();
  const SiderToRender = Sider ?? DefaultSider;
  const HeaderToRender = Header ?? DefaultHeader;
  const isSmall = typeof breakpoint.sm === "undefined" ? true : breakpoint.sm;
  const hasSider = !!SiderToRender({ Title });
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
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
  useEffect(()=>{
    console.log(searchTerm);
    getData()
  }, [searchTerm])
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const onSearch = e => setSearchTerm(e.target.value);
  const onSearchDebounce = debounce(onSearch, 1000)
  const { show } = useNavigation();
  return (
    <ThemedLayoutContextProvider initialSiderCollapsed={initialSiderCollapsed}>
      <AntdLayout style={{ minHeight: "100vh" }} hasSider={hasSider}>
        <SiderToRender Title={Title} />
        <AntdLayout>
          <HeaderToRender />
          <AntdLayout.Content>
            <SearchModal open={isModalOpen} setOpen={setIsModalOpen} />
            {/* <Modal open={isModalOpen}>
              <Input 
                type="text" 
                placeholder="Enter Account Code to search"
                onChange={onSearchDebounce} 
                />
                <List
                itemLayout="horizontal"
                dataSource={searchResults}
                renderItem={(item) => 
                (
                  <div>
                    <Button type="link" onClick={() => show('accounts', item.id, 'push')}>
                    {`code: ${item.code}`}
                    </Button> <br />
                    {`name: ${item.name}`} <br />
                    {`balance: ${item.accounts_balance.balance}`} <br />
                  </div>
                )
                }
                />
            </Modal> */}
            <FloatButton 
              icon={<SearchOutlined />}
              onClick={()=> toggleModal()}
            ></FloatButton>
            <div
              style={{
                minHeight: 360,
                padding: isSmall ? 24 : 12,
              }}
            >
              {children}
            </div>
            {OffLayoutArea && <OffLayoutArea />}
          </AntdLayout.Content>
          {Footer && <Footer />}
        </AntdLayout>
      </AntdLayout>
    </ThemedLayoutContextProvider>
  );
};
