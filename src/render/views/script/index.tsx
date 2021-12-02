import { Button, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import store, { Script } from '../../../main/store';
import AddView from './AddView';
import ItemCard from './ItemCard';

const ScriptView = () => {
  interface State {
    scripts: Script[];
    status: 'add' | 'edit' | 'view';
    editKey: string;
  }
  const [state, setState] = useState<State>({
    scripts: [],
    status: 'view',
    editKey: '',
  });
  const handleGetScript = useCallback(() => {
    setState((pre) => {
      return {
        ...pre,
        scripts: store.get('scripts'),
      };
    });
  }, []);

  useEffect(() => {
    handleGetScript();
  }, [handleGetScript]);

  const { status, scripts, editKey } = state;

  const goView = () => {
    setState((pre) => {
      return {
        ...pre,
        status: 'view',
      };
    });
    handleGetScript();
  };

  const goAdd = () => {
    setState((pre) => {
      return {
        ...pre,
        status: 'add',
      };
    });
  };

  const goEdit = (key: string) => {
    setState((pre) => {
      return {
        ...pre,
        status: 'edit',
        editKey: key,
      };
    });
  };

  const onAdd = (data: Omit<Script, 'key'>) => {
    store.set('scripts', [
      ...scripts,
      {
        ...data,
        key: uuidv4(),
      },
    ]);
    goView();
  };

  const onEdit = (data: Omit<Script, 'key'>) => {
    store.set(
      'scripts',
      scripts.map((item) => {
        if (item.key === editKey) {
          return {
            ...item,
            ...data,
          };
        }
        return item;
      })
    );
    goView();
  };

  const handleRefresh = () => {
    handleGetScript();
    message.success('刷新成功');
  };

  const onDelete = (key: string) => {
    store.set(
      'scripts',
      scripts.filter((s) => s.key !== key)
    );
    handleGetScript();
    message.success('删除成功');
  };

  const selectData = useMemo(() => {
    return state.scripts.find((item) => item.key === state.editKey);
  }, [state.editKey, state.scripts]);
  return (
    <div style={{ display: 'flex', flex: 1, padding: 6, overflow: 'hidden' }}>
      {status === 'view' && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <div>
            <Button onClick={handleRefresh}>刷新</Button>
            <Button onClick={goAdd} style={{ marginLeft: 6 }}>
              新增
            </Button>
          </div>
          <div
            style={{
              marginTop: 6,
              flex: 1,
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {state.scripts.map((item) => {
              return (
                <div
                  key={item.key}
                  style={{
                    width: '45%',
                    marginRight: '5%',
                    height: 350,
                    overflow: 'hidden',
                    marginBottom: 12,
                  }}
                >
                  <ItemCard
                    name={item.name}
                    scriptTemplate={item.scriptTemplate}
                    presetParams={item.presetParams}
                    currentKey={item.key}
                    key={item.key}
                    onEdit={goEdit}
                    onDelete={onDelete}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {status === 'add' && <AddView onCancel={goView} onOk={onAdd} />}
      {status === 'edit' && selectData && (
        <AddView
          presetParams={selectData.presetParams}
          name={selectData.name}
          scriptTemplate={selectData.scriptTemplate}
          onCancel={goView}
          onOk={onEdit}
        />
      )}
    </div>
  );
};

export default ScriptView;
