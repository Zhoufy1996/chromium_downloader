import { Card, Input, Form, Button, AutoComplete } from 'antd';
import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Script } from '../../../main/store';
import { handleExecuteScript } from '../../utils';

interface ItemCardProps extends Script {
  onEdit: (k: string) => void;
  currentKey: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  scriptTemplate,
  presetParams,
  currentKey,
  onEdit = () => {},
}) => {
  const paramNames = [
    ...new Set(
      scriptTemplate.match(/{.*?}/g)?.map((param) => {
        return param.substring(1, param.length - 1);
      })
    ),
  ];
  const [form] = Form.useForm();
  const onExecute = (params: { [name: string]: string }) => {
    handleExecuteScript({
      scriptTemplate,
      params,
    });
  };
  return (
    <Card
      title={name}
      extra={
        <Button
          onClick={() => onEdit(currentKey)}
          shape="circle"
          icon={<EditOutlined />}
        />
      }
    >
      <div>{scriptTemplate}</div>
      <div>
        <Form form={form} onFinish={onExecute}>
          {paramNames?.map((param) => {
            return (
              <Form.Item key={param} name={param} label={param}>
                <AutoComplete
                  options={presetParams.map((item) => {
                    return {
                      label: item.alias,
                      value: item[param],
                    };
                  })}
                >
                  <Input placeholder="..." />
                </AutoComplete>
              </Form.Item>
            );
          })}
          <Button htmlType="submit">运行</Button>
        </Form>
      </div>
    </Card>
  );
};

export default ItemCard;
