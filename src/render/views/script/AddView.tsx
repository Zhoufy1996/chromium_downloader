import { Button, Form, FormProps, Input, message, Steps } from 'antd';
import React, { useCallback, useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Script } from '../../../main/store';
import EditableTable from '../../components/EditableTable';
import { handleGetParams } from '../../utils';

interface FirstStepViewProps {
  form: FormProps['form'];
  name: string;
  scriptTemplate: string;
}

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const FirstStepView: React.FC<FirstStepViewProps> = ({
  form,
  name,
  scriptTemplate,
}) => {
  return (
    <div>
      <Form {...formLayout} form={form}>
        <Form.Item
          rules={[
            {
              required: true,
              message: '请输入脚本名称',
            },
          ]}
          initialValue={name}
          name="name"
          label="脚本名"
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: '请输入脚本代码',
            },
          ]}
          initialValue={scriptTemplate}
          name="scriptTemplate"
          label="脚本"
        >
          <Input style={{ width: 300 }} />
        </Form.Item>
      </Form>
    </div>
  );
};

interface AddViewProps {
  onOk: (data: Omit<Script, 'key'>) => void;
  onCancel: () => void;
  presetParams?: Script['presetParams'];
  name?: Script['name'];
  scriptTemplate?: Script['scriptTemplate'];
}

const AddView: React.FC<AddViewProps> = ({
  onCancel,
  onOk,
  presetParams = [],
  name = '',
  scriptTemplate = '',
}) => {
  interface State {
    presetParams: Script['presetParams'];
    currentStep: number;
    name: string;
    scriptTemplate: string;
  }

  const [state, setState] = useState<State>({
    presetParams,
    currentStep: 0,
    name,
    scriptTemplate,
  });

  const { currentStep } = state;

  const [form] = Form.useForm();

  const paramNames = handleGetParams(state.scriptTemplate);
  const onSave = () => {
    if (state.name === '' || state.scriptTemplate === '') {
      message.error('请填写完整');
      return;
    }

    onOk({
      presetParams: state.presetParams,
      name: state.name,
      scriptTemplate: state.scriptTemplate,
    });
  };

  const goToSecond = async () => {
    const data = await form.validateFields();
    setState((pre) => {
      return {
        ...pre,
        scriptTemplate: data.scriptTemplate,
        name: data.name,
        currentStep: 1,
      };
    });
  };

  const goToFirst = async () => {
    setState((pre) => {
      return {
        ...pre,
        currentStep: 0,
      };
    });
  };

  const onSecondSave = useCallback((data) => {
    setState((pre) => {
      return {
        ...pre,
        presetParams: data,
      };
    });
  }, []);
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button
            onClick={onCancel}
            shape="circle"
            icon={<ArrowLeftOutlined />}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flex: 1,
            padding: 6,
            justifyContent: 'center',
          }}
        >
          <Steps current={state.currentStep} style={{ width: 200 }}>
            <Steps.Step title="脚本" />
            <Steps.Step title="预设" />
          </Steps>
        </div>
        <div>
          {state.currentStep === 0 && (
            <Button onClick={goToSecond}>下一步</Button>
          )}
          {state.currentStep === 1 && (
            <>
              <Button onClick={goToFirst} style={{ marginRight: 6 }}>
                上一步
              </Button>
              <Button onClick={onSave}>保存</Button>
            </>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: 12 }}>
        {currentStep === 0 && (
          <FirstStepView
            form={form}
            name={name}
            scriptTemplate={scriptTemplate}
          />
        )}
        {currentStep === 1 && (
          <EditableTable
            onSave={onSecondSave}
            paramNames={['alias', ...paramNames]}
            originData={state.presetParams}
          />
        )}
      </div>
    </div>
  );
};

export default AddView;
