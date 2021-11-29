import { Input, Switch, SwitchProps, Tag } from 'antd';
import { SearchProps } from 'antd/lib/input';
import React, { useEffect, useMemo, useState } from 'react';
import ChromiumContainer from '../../stores/chromium';
import IpcResContainer from '../../stores/ipcRes';
import HelpActions from './HelpActions';
import ItemTag from './ItemTag';

const ChromiumTag = () => {
  const { chromiumSpiderRes } = IpcResContainer.useContainer();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (chromiumSpiderRes) {
      setVisible(true);
    }
  }, [chromiumSpiderRes]);

  return chromiumSpiderRes ? (
    <Tag
      color="processing"
      visible={visible}
      onClick={() => {
        setVisible(false);
      }}
    >
      {chromiumSpiderRes}
    </Tag>
  ) : null;
};

const { Search } = Input;

const ChromiumView = () => {
  interface State {
    text: string;
    onlyShowDownloaded: boolean;
    tagVisible: boolean;
  }
  const [state, setState] = useState<State>({
    text: '',
    onlyShowDownloaded: false,
    tagVisible: false,
  });

  const {
    localChromiumData,
    revisionToVersionMap,
  } = ChromiumContainer.useContainer();

  const onSearch: SearchProps['onSearch'] = (value) => {
    setState((pre) => {
      return {
        ...pre,
        text: value,
      };
    });
  };

  const changeSwitch: SwitchProps['onChange'] = (checked) => {
    setState((pre) => {
      return {
        ...pre,
        onlyShowDownloaded: checked,
      };
    });
  };

  const dataSource = useMemo(() => {
    const revisionList = Object.keys(revisionToVersionMap);
    return revisionList.map((revision) => {
      const localItem = localChromiumData.find(
        (item) => item.revision === revision
      );
      return {
        revision,
        version: revisionToVersionMap[revision],
        isDownloaded: !!localItem,
        executablePath: localItem ? localItem.executablePath : '',
        folderPath: localItem ? localItem.folderPath : '',
      };
    });
  }, [revisionToVersionMap, localChromiumData]);

  const dataSourceShow = useMemo(() => {
    return dataSource
      .filter((data) => !state.onlyShowDownloaded || data.isDownloaded)
      .filter((data) => data.version.includes(state.text));
  }, [dataSource, state.text, state.onlyShowDownloaded]);

  return (
    <div
      style={{
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}
    >
      <div style={{ display: 'flex', marginBottom: 6, alignItems: 'center' }}>
        <Search
          style={{ width: 200, marginRight: 12 }}
          placeholder="..."
          onSearch={onSearch}
          enterButton
        />
        <Switch
          style={{ marginRight: 12 }}
          checked={state.onlyShowDownloaded}
          onChange={changeSwitch}
        />
        <HelpActions style={{ marginRight: 12 }} />
        <ChromiumTag />
      </div>
      <div style={{ overflow: 'auto', flex: 1 }}>
        {dataSourceShow.map((data) => {
          return (
            <ItemTag
              version={data.version}
              revision={data.revision}
              isDownloaded={data.isDownloaded}
              executablePath={data.executablePath}
              folderPath={data.folderPath}
              key={data.revision}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ChromiumView;
