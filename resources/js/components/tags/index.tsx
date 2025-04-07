import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, InputRef, Typography } from 'antd';
import { Flex, Input, Tag, theme, Tooltip } from 'antd';
import { useStyles } from './styled';
import { Select } from 'antd/lib';
import { useSelect } from '@refinedev/antd';
import { ITag } from '@/interfaces';
import { DefaultOptionType } from 'antd/es/select';

// const tagInputStyle: React.CSSProperties = {
//   width: 64,
//   height: 22,
//   marginInlineEnd: 8,
//   verticalAlign: 'top',
// };

export const DisplayTags = ({recordID, initialTags, handleTagsUpdate}) => {
  const { token } = theme.useToken();
  const { styles } = useStyles();
  const [tags, setTags] = useState<ITag[]>(initialTags);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);
  const [showUpdateBtn,setShowUpdateBtn] = useState(false);
  const { selectProps, query } = useSelect<ITag>({
    resource: 'tags',
    optionLabel: 'label',
    optionValue: 'id',
    // filters: [
    //   {
    //     field: 'label',
    //     operator: 'nin',
    //     value: [...initialTags.map(({label}) => label)]
    //   }
    // ]
  })
  // console.log('query', query);
  const [optionTags, setOptionTags] = useState<DefaultOptionType[] | undefined>([]);

  useEffect(() => {
    if (query.isSuccess && selectProps.options?.length) {
      const existingTags = tags.map(({label}) => label);
      const filteredTags = selectProps.options?.filter(({label}) => !existingTags.includes(label as any));
      // console.log('updating', existingTags, filteredTags, selectProps.options, query);

      setOptionTags(filteredTags)
    }
  }, [selectProps.options])
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [editInputValue]);

  // useEffect(() => {
    
  //   const existingTags = tags.map(({label}) => label);

  //   const filteredTags = selectProps.options?.filter(({label}) => !existingTags.includes(label as any));
  //   // console.log(selectProps, tags, filteredTags );

  //   setOptionTags(filteredTags)

  // }, [tags]);

  // useEffect(() => {
  //   // console.log(selectProps, query);
  // }, [selectProps])

  const handleTagsChange = (value, option) => {
    
    const newTag = {id : option.value, label : option.label}
    setTags([...tags, newTag]);
    console.log('tags', value, option)
    const existingTags = tags.map(({label}) => label);
    const filteredTags = optionTags?.filter(({label}) => !existingTags.includes(label as any));
    console.log('filteredTags', filteredTags, optionTags, tags);
    setOptionTags(filteredTags)
    // const filteredTags = selectProps.options?.filter(({label}) => !existingTags.includes(label));
    setShowUpdateBtn(true);
    setInputVisible(false);
  }
  const handleClose = (removedTag: number) => {
    const newTags = tags.filter((tag) => tag.id !== removedTag);
    console.log(newTags);
    setTags(newTags);
    setInputVisible(false);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

//   const handleInputConfirm = () => {
//     if (inputValue && !tags.includes(inputValue)) {
//       setTags([...tags, inputValue]);
//     }
//     setInputVisible(false);
//     setInputValue('');
//   };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

//   const handleEditInputConfirm = () => {
//     const newTags = [...tags];
//     newTags[editInputIndex] = editInputValue;
//     setTags(newTags);
//     setEditInputIndex(-1);
//     setEditInputValue('');
//   };

//   const tagPlusStyle: React.CSSProperties = {
//     height: 22,
//     background: token.colorBgContainer,
//     borderStyle: 'dashed',
//   };

  return (
    <Flex gap="4px 0" wrap>
      {tags.map<React.ReactNode>((tag, index) => {
        // if (editInputIndex === index) {
        //   return (
        //     <Input
        //       ref={editInputRef}
        //       key={tag}
        //       size="small"
        //       className={styles.tagInput}
        //       value={editInputValue}
        //       onChange={handleEditInputChange}
        //       onBlur={handleEditInputConfirm}
        //       onPressEnter={handleEditInputConfirm}
        //     />
        //   );
        // }
        const isLongTag = tag.label.length > 20;
        const tagElem = (
          <Tag
            key={tag.id}
            closable={index !== 0}
            style={{ userSelect: 'none' }}
            onClose={() => handleClose(tag.id)}
          >
            <span
            //   onDoubleClick={(e) => {
            //     if (index !== 0) {
            //       setEditInputIndex(index);
            //       setEditInputValue(tag);
            //       e.preventDefault();
            //     }
            //   }}
            >
              {isLongTag ? `${tag.label.slice(0, 20)}...` : tag.label}
            </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag.label} key={tag.id}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible ? (
        // <Input
        //   ref={inputRef}
        //   type="text"
        //   size="small"
        //   className={styles.tagInput}
        //   value={inputValue}
        //   onChange={handleInputChange}
        //   onBlur={handleInputConfirm}
        //   onPressEnter={handleInputConfirm}
        // />
        <Select
        placeholder={<Typography.Text>New Tag</Typography.Text>}
        className={styles.tagInput}
        onChange={handleTagsChange}
        {...selectProps}
        options={optionTags}
        />      
      ) : (
        <Tag className={styles.tagPlus} icon={<PlusOutlined />} onClick={showInput}>
          New Tag
        </Tag>
      )}
      <Button type="primary" disabled={!showUpdateBtn} onClick={() => handleTagsUpdate(recordID, tags)}>Update</Button>
    </Flex>
  );
};
