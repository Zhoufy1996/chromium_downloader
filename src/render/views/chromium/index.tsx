import { Input, Switch, SwitchProps, Tag } from 'antd';
import { SearchProps } from 'antd/lib/input';
import React, { useMemo, useState } from 'react';
import ChromiumContainer from '../../stores/chromium';
import IpcResContainer from '../../stores/ipcRes';
import HelpActions from './HelpActions';
import ItemTag from './ItemTag';

const { Search } = Input;

const ChromiumView = () => {
  interface State {
    text: string;
    onlyShowDownloaded: boolean;
  }
  const [state, setState] = useState<State>({
    text: '',
    onlyShowDownloaded: false,
  });

  const {
    localChromiumData,
    revisionToVersionMap,
  } = ChromiumContainer.useContainer();
  const { chromiumSpiderRes } = IpcResContainer.useContainer();

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
    <div>
      <div>
        <Search placeholder="..." onSearch={onSearch} enterButton />
        <Switch checked={state.onlyShowDownloaded} onChange={changeSwitch} />
        <HelpActions />
        {chromiumSpiderRes && <Tag color="processing">{chromiumSpiderRes}</Tag>}
      </div>
      <div>
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
