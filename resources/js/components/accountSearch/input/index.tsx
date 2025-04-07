import { Input } from "antd"
import debounce from "lodash/debounce";
import { useState } from "react";

export const SearchInput = ({setSearchTerm}) => {
    const onSearch = e => setSearchTerm(e.target.value); 
    const onSearchDebounce = debounce(onSearch, 1000);
    return (
        <Input
        type="text"
        placeholder="Enter Code"
        onPressEnter={onSearchDebounce}
        />
    )
}