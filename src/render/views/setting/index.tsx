import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import store, { Setting } from '../../../main/store';

const SettingView = () => {
  interface State {
    setting: Setting;
  }
  const [state, setState] = useState<State>({
    setting: store.get('setting'),
  });

  const [form] = Form.useForm();
  const { setting } = state;

  const refreshData = () => {
    setState((pre) => {
      return {
        ...pre,
        setting: store.get('setting'),
      };
    });
    form.resetFields();
  };

  const onSave = async () => {
    const values = await form.validateFields();
    store.set(
      'setting',
      Object.fromEntries(
        Object.keys(values).map((key) => {
          return [
            key,
            {
              value: values[key],
              type: setting[key].type,
              label: setting[key].label,
            },
          ];
        })
      )
    );
    message.success('保存成功');
    refreshData();
  };
  return (
    <div style={{ padding: 12 }}>
      <Form form={form}>
        {Object.keys(setting).map((key) => {
          const settingKey = key as keyof Setting;
          const item = setting[settingKey];
          return (
            <Form.Item
              label={item.label}
              name={settingKey}
              initialValue={item.value}
              key={key}
            >
              <Input />
            </Form.Item>
          );
        })}
      </Form>
      <Button type="default" onClick={onSave}>
        保存
      </Button>
    </div>
  );
};

export default SettingView;
