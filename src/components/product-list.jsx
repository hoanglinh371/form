import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Row, Col, Input, Table, InputNumber, Button, Form } from 'antd';

import { getProducts } from '../api/product';

export default function ProductList() {
  const [form] = Form.useForm();

  const [params, setParams] = useState({
    page: 1,
    itemsPerPage: 5,
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  });

  const handlePageChange = (page) => {
    setParams({
      ...params,
      page,
    });
  };

  const handleFilter = (values) => {
    if (values.minPrice > values.maxPrice) {
      alert('Hãy nhập đúng khoảng giá!');
      return;
    }

    setParams({
      ...params,
      ...values,
    });
  };

  const handleReset = () => {
    setParams({
      ...params,
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
    });
    form.resetFields();
  };

  const columns = [
    {
      key: 'id',
      title: '#',
      dataIndex: 'id',
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
  ];

  return (
    <div
      style={{
        maxWidth: '1024px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      <Card>
        <Form
          form={form}
          name="filter-form"
          id="filter-form"
          onFinish={handleFilter}
        >
          <Row gutter={[24, 24]}>
            <Col span={12}>
              <Form.Item name="search" label={<span>Search</span>}>
                <Input placeholder="Search by product name here..." />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="minPrice" label={<span>Min Price</span>}>
                <InputNumber
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="maxPrice" label={<span>Max Price</span>}>
                <InputNumber
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                />
              </Form.Item>
            </Col>

            <Col>
              <Button type="primary" htmlType="submit">
                Filter
              </Button>
            </Col>
            <Col>
              <Button onClick={handleReset}>Reset</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title={<span>Product List</span>}>
        <Table
          columns={columns}
          dataSource={data?.items}
          loading={isLoading}
          pagination={{
            total: data?.totalItems,
            pageSize: data?.itemsPerPage,
            onChange: handlePageChange,
          }}
        />
      </Card>
    </div>
  );
}
