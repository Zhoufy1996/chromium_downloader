import React, { useEffect, useMemo, useState } from 'react';
import { Tag } from 'antd';
import ChromiumContainer from '../../stores/chromium';
import HelpActions from './HelpActions';
import ItemTag from './ItemTag';

const ChromiumTag = () => {
  const { chromiumSpiderRes } = ChromiumContainer.useContainer();
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

const ChromiumView = () => {
  const {
    localChromiumData,
    revisionToVersionMap,
  } = ChromiumContainer.useContainer();

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
    return dataSource;
  }, [dataSource]);

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
