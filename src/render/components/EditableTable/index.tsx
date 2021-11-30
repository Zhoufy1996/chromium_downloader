/* eslint-disable react/display-name */
import { Button, Table, Form, Input, TableProps } from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './style.css';

interface Item {
  key: string;
  [k: string]: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  record,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input style={{ width: '80%' }} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

interface EditableTableProps {
  originData: Item[];
  paramNames: string[];
  onSave: (dataSource: Item[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({
  paramNames,
  originData,
  onSave,
}) => {
  interface State {
    editRowKey: string;
    dataSource: Item[];
  }
  const [form] = Form.useForm();
  const [state, setState] = useState<State>({
    editRowKey: '',
    dataSource: originData,
  });
  console.log(state);
  const isEditing = (record: Item) => record.key === state.editRowKey;

  const hasEditRow = state.editRowKey !== '';

  const edit = (item: Item) => {
    form.setFieldsValue(
      Object.fromEntries(
        paramNames.map((name) => {
          return [name, item[name] || ''];
        })
      )
    );
    console.log(form.getFieldsValue());
    setState((pre) => {
      return {
        ...pre,
        editRowKey: item.key,
      };
    });
  };

  const cancel = () => {
    setState((pre) => {
      return {
        ...pre,
        editRowKey: '',
      };
    });
  };

  const save = async () => {
    const row = (await form.validateFields()) as Item;
    const newData = state.dataSource.map((record) => {
      if (isEditing(record)) {
        return {
          ...record,
          ...row,
        };
      }
      return record;
    });
    setState((pre) => {
      return {
        ...pre,
        dataSource: newData,
        editRowKey: '',
      };
    });
  };

  const add = () => {
    setState((pre) => {
      return {
        ...pre,
        dataSource: [
          ...pre.dataSource,
          {
            ...Object.fromEntries(
              paramNames.map((name) => {
                return [name, ''];
              })
            ),
            key: uuidv4(),
          },
        ],
      };
    });
  };

  const columns: TableProps<Item>['columns'] = [
    {
      title: 'seq',
      key: 'seq',
      width: 60,
      render: (text, record, index) => {
        return index + 1;
      },
    },
    ...paramNames.map((name) => {
      return {
        dataIndex: name,
        key: name,
        title: name,
        onCell: (record: Item) => ({
          record,
          dataIndex: name,
          title: name,
          editing: isEditing(record),
        }),
      };
    }),
    {
      title: 'operation',
      dataIndex: 'operation',
      key: 'operation',
      width: 180,
      render: (_, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <div>
            <Button
              type="text"
              onClick={() => {
                save();
              }}
            >
              save
            </Button>
            <Button
              type="text"
              onClick={() => {
                cancel();
              }}
            >
              cancel
            </Button>
          </div>
        ) : (
          <Button
            disabled={hasEditRow}
            type="text"
            onClick={() => {
              edit(record);
            }}
          >
            edit
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    onSave(state.dataSource);
  }, [state.dataSource, onSave]);

  return (
    <div>
      <div>
        <Button onClick={add}>添加</Button>
      </div>
      <div style={{ marginTop: 6 }}>
        <Form form={form} component={false}>
          <Table
            columns={columns}
            components={{ body: { cell: EditableCell } }}
            dataSource={state.dataSource}
            bordered
            pagination={false}
            rowClassName="editable-row"
          />
        </Form>
      </div>
    </div>
  );
};

export default EditableTable;
