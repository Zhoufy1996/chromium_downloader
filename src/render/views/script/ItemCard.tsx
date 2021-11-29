import { Card, Input, Form, Button } from 'antd';
import React from 'react';
import { Script } from '../../../main/store';
import { handleExecuteScript } from '../../utils';

type ItemCardProps = Script;

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  scriptTemplate,
  presetParams,
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
    <Card title={name}>
      <div>脚本模板：{scriptTemplate}</div>
      <div>
        参数：
        <Form form={form} onFinish={onExecute}>
          {paramNames?.map((param) => {
            return (
              <Form.Item key={param} label={param}>
                <Input />
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
