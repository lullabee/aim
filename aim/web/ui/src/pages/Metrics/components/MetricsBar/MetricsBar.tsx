import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';

import { Divider, MenuItem } from '@material-ui/core';

import BookmarkForm from 'components/BookmarkForm/BookmarkForm';
import AppBar from 'components/AppBar/AppBar';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import LiveUpdateSettings from 'components/LiveUpdateSettings/LiveUpdateSettings';
import { Button, Icon, Text } from 'components/kit';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';
import ConfirmModal from 'components/ConfirmModal/ConfirmModal';

import { DOCUMENTATIONS } from 'config/references';

import bookmarkAppModel from 'services/models/bookmarks/bookmarksAppModel';

import { IMetricsBarProps } from 'types/pages/metrics/components/MetricsBar/MetricsBar';

import { useModel } from 'hooks';

import './MetricsBar.scss';

function MetricsBar({
  title,
  explorerName = 'METRICS',
  liveUpdateConfig,
  disabled,
  onBookmarkCreate,
  onBookmarkUpdate,
  onResetConfigData,
  onLiveUpdateConfigChange,
}: IMetricsBarProps): React.FunctionComponentElement<React.ReactNode> {
  const [popover, setPopover] = React.useState<string>('');

  const route = useRouteMatch<any>();
  const bookmarksState = useModel(bookmarkAppModel, false);

  React.useEffect(() => {
    bookmarkAppModel.initialize();
    return () => {
      bookmarkAppModel.destroy();
    };
  }, []);

  const metricsBookmarks = React.useMemo(
    () =>
      (bookmarksState?.listData ?? []).filter(
        (bm: any) => bm.type === 'metrics',
      ),
    [bookmarksState?.listData],
  );

  function handleBookmarkClick(value: string): void {
    setPopover(value);
  }

  function handleClosePopover(): void {
    setPopover('');
  }

  function handleBookmarkUpdate(): void {
    onBookmarkUpdate(route.params.appId);
    handleClosePopover();
  }

  return (
    <ErrorBoundary>
      <AppBar title={title} disabled={disabled}>
        <LiveUpdateSettings
          {...liveUpdateConfig}
          onLiveUpdateConfigChange={onLiveUpdateConfigChange}
        />
        <ErrorBoundary>
          <ControlPopover
            title='Bookmarks'
            anchor={({ onAnchorClick }) => (
              <Button
                color='secondary'
                className='MetricsBar__item__bookmark'
                size='small'
                onClick={onAnchorClick}
              >
                <Text size={14} className='MetricsBar__item__bookmark__Text'>
                  Bookmarks
                </Text>
                <Icon
                  fontSize={14}
                  name='bookmarks'
                  className='MetricsBar__item__bookmark__Icon'
                />
              </Button>
            )}
            component={
              <div className='MetricsBar__popover MetricsBar__bookmarks__popover'>
                <MenuItem onClick={() => handleBookmarkClick('create')}>
                  Create Bookmark
                </MenuItem>
                {route.params.appId && (
                  <MenuItem onClick={() => handleBookmarkClick('update')}>
                    Update Bookmark
                  </MenuItem>
                )}
                {metricsBookmarks.length > 0 && (
                  <>
                    <Divider />
                    <div className='MetricsBar__bookmarks__list'>
                      {metricsBookmarks.map((bm: any) => (
                        <NavLink
                          key={bm.id}
                          to={`/metrics/${bm.app_id}`}
                          className='MetricsBar__bookmarks__item'
                        >
                          <Icon name='bookmarks' fontSize={12} />
                          <Text size={13} tint={100}>
                            {bm.name}
                          </Text>
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </div>
            }
          />
        </ErrorBoundary>
        <div className='MetricsBar__menu'>
          <ErrorBoundary>
            <ControlPopover
              title='Menu'
              anchor={({ onAnchorClick }) => (
                <Button
                  withOnlyIcon
                  color='secondary'
                  size='small'
                  onClick={onAnchorClick}
                >
                  <Icon
                    fontSize={16}
                    name='menu'
                    className='MetricsBar__item__bookmark__Icon'
                  />
                </Button>
              )}
              component={
                <div className='MetricsBar__popover'>
                  <MenuItem onClick={onResetConfigData}>
                    Reset Controls to System Defaults
                  </MenuItem>
                  <a
                    href={DOCUMENTATIONS.EXPLORERS[explorerName].MAIN}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <MenuItem>Explorer Documentation</MenuItem>
                  </a>
                </div>
              }
            />
          </ErrorBoundary>
        </div>
        <ErrorBoundary>
          <BookmarkForm
            onBookmarkCreate={onBookmarkCreate}
            onClose={handleClosePopover}
            open={popover === 'create'}
          />
        </ErrorBoundary>
        <ConfirmModal
          open={popover === 'update'}
          onCancel={handleClosePopover}
          onSubmit={handleBookmarkUpdate}
          text='Are you sure you want to update bookmark?'
          icon={<Icon name='check' />}
          title='Update bookmark'
          statusType='success'
          confirmBtnText='Update'
        />
      </AppBar>
    </ErrorBoundary>
  );
}

export default React.memo(MetricsBar);
