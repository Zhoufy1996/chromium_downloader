import {
  Card,
  Input,
  Form,
  AutoComplete,
  Menu,
  Dropdown,
  Modal,
  Tooltip,
} from 'antd';
import React from 'react';
import { clipboard } from 'electron';
import { Script } from '../../../main/store';
import { handleExecuteScript, handleTransformScript } from '../../utils';
import './style.less';

interface ItemCardProps extends Script {
  onEdit: (k: string) => void;
  onDelete: (k: string) => void;
  currentKey: string;
}

const ItemCard: React.FC<ItemCardProps> = ({
  name,
  scriptTemplate,
  presetParams,
  currentKey,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const paramNames = [
    ...new Set(
      scriptTemplate.match(/{.*?}/g)?.map((param) => {
        return param.substring(1, param.length - 1);
      })
    ),
  ];
  const [form] = Form.useForm();
  const onExecute = async () => {
    const params = await form.validateFields();
    handleExecuteScript({
      scriptTemplate,
      params,
    });
  };
  const menu = (
    <Menu
      onClick={async ({ key }) => {
        if (key === 'edit') {
          onEdit(currentKey);
        }

        if (key === 'delete') {
          Modal.confirm({
            content: `确定删除脚本【${name}】吗`,
            onOk: () => {
              onDelete(currentKey);
            },
            onCancel: () => {},
          });
        }

        if (key === 'copy') {
          const params = await form.validateFields();
          clipboard.writeText(
            handleTransformScript({
              scriptTemplate,
              params,
            })
          );
        }
      }}
    >
      <Menu.Item key="edit">编辑</Menu.Item>
      <Menu.Item key="delete">删除</Menu.Item>
      <Menu.Item key="copy">复制</Menu.Item>
    </Menu>
  );
  return (
    <Card
      title={
        <Tooltip title={`${name} ${scriptTemplate}`}>
          {`${name} ${scriptTemplate}`}
        </Tooltip>
      }
      extra={
        <div>
          <Dropdown.Button overlay={menu} onClick={onExecute}>
            运行
          </Dropdown.Button>
        </div>
      }
      className="hidden-scroll-card"
    >
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
                <Input.TextArea placeholder="..." spellCheck={false} />
              </AutoComplete>
            </Form.Item>
          );
        })}
      </Form>
    </Card>
  );
};

export default ItemCard;
