import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Flex, Form, message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import { UploadFile } from 'antd/lib';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};



export const LogoUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // const handleChange: UploadProps['onChange'] = (info) => {
  //   setFileList([...info.fileList])
  //   // if (info.file.status === 'uploading') {
  //   //   setLoading(true);
  //   //   return;
  //   // }
  //   // if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as FileType, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   // }
  // };

  const UploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    // if (!isJpgOrPng) {
    //   message.error('You can only upload JPG/PNG file!');
    // }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('Image must smaller than 2MB!');
    // }
    return false;
  };
  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    // <Flex gap="middle" wrap="wrap">
    <Form.Item
    label="Logo"
    name="logo_file"
    valuePropName="fileList"
    getValueFromEvent={normFile}
    className="samer-formitem"
    // noStyle
  >
      <Upload
        name="logo"
        maxCount={1}
        listType="picture-circle"
        className="avatar-uploader"
        // showUploadList={true}
        fileList={fileList}
        beforeUpload={beforeUpload}
        // onChange={handleChange}
        showUploadList={{showRemoveIcon: true}}
      >
        { UploadButton}
      </Upload>
      </Form.Item>
    // </Flex>
  );
};