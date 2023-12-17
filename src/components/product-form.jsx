import { useMutation } from '@tanstack/react-query';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
} from 'antd';
import { useState } from 'react';

import { createProduct } from '../api/product';

const uploadButton = (
  <div>
    +<div>Upload</div>
  </div>
);

export default function ProductForm() {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const { mutate } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      console.log('done');
    },
    onError: () => {
      console.log('error');
    },
  });

  const categories = [
    {
      value: 1,
      label: 'Áo thun',
    },
  ];

  const handleImageChange = (info) => {
    const { file, fileList: newFileList } = info;
    if (info.file.status === 'done') {
      form.setFieldValue('image', file.response.image_url);
      setFileList(newFileList);
    }

    if (info.file.status === 'uploading') {
      setFileList(newFileList);
      form.setFieldValue('image', undefined);
    }

    if (info.file.status === 'removed') {
      setFileList(newFileList);
      form.setFieldValue('image', undefined);
    }
  };

  const handleFormFinish = async (values) => {
    mutate(values);
  };

  const handleFormClear = () => {
    form.resetFields();
  };

  return (
    <Card
      title={<span>Create product</span>}
      extra={<Button onClick={handleFormClear}>Clear form</Button>}
      className="product-form-container"
    >
      <Form
        form={form}
        layout="vertical"
        id="product-form"
        name="product-form"
        onFinish={handleFormFinish}
      >
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập tên sản phẩm!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Mô tả"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập mô tả sản phẩm!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Ảnh"
              name="image"
              rules={[
                {
                  required: true,
                  message: 'Hãy tải 1 ảnh sản phẩm!',
                },
              ]}
            >
              <Upload
                action="http://127.0.0.1:8000/api/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={handleImageChange}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Giá"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Hãy nhập giá sản phẩm!',
                },
                {
                  pattern: /^\d+$/,
                  message: 'Giá sản phẩm không được âm.',
                },
              ]}
            >
              <InputNumber
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Danh mục"
              name="category_id"
              rules={[
                {
                  required: true,
                  message: 'Hãy chọn danh mục sản phẩm!',
                },
              ]}
            >
              <Select options={categories} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
