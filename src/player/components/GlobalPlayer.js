import React from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash.get';
import { useLocation } from '@reach/router';
import c from 'classnames';

import { PlayerStatus } from '@/player/constants';
import { useClickAction } from '@/player/hooks';
import { getMeta, getProgress, getSrc, getStatus } from '@/player/selectors';
import DefaultCover from '@/static/images/default.png';
import { Box, Flex } from '@/ui';

import StatusIndicator from './StatusIndicator';
import ProgressBar from './ProgressBar';

import styles from './Player.module.css';

const { BUFFERING } = PlayerStatus;

function Meta({ meta }) {
  const { artist, cover, title } = meta;
  return (
    <div className={c(styles.meta, 'd-flex')}>
      <img
        className={c(styles.metaCover, 'mr-2', 'mr-md-3')}
        src={cover || DefaultCover}
      />
      <div className="d-flex flex-column justify-content-center overflow-hidden">
        <p className={c(styles.metaTruncated, 'h6', 'font-weight-bold', 'm-0')}>
          {title}
        </p>
        <p className={c(styles.metaTruncated, 'h6', 'm-0', 'text-muted')}>
          {artist}
        </p>
      </div>
    </div>
  );
}

export function GlobalPlayer() {
  const meta = useSelector(getMeta);
  const progress = useSelector(getProgress);
  const src = useSelector(getSrc);
  const status = useSelector(getStatus);

  const onClickAction = useClickAction(src, meta);
  const location = useLocation();

  const duration = get(meta, 'duration', 0);
  const isVisible = status >= BUFFERING && location.pathname !== '/';

  return (
    <Box
      position="fixed"
      right={0}
      bottom={0}
      left={0}
      px={4}
      py={2}
      bg="white"
      borderTop="1px solid #eeee"
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 150ms ease-out, opacity 150ms ease-out',
        zIndex: 3
      }}
    >
      <Flex
        alignItems="center"
        flexDirection={['row-reverse', 'row']}
        justifyContent="space-between"
        mx="auto"
        width={[1, null, 960, 1140]}
      >
        <StatusIndicator
          color="black"
          onClick={onClickAction}
          size={20}
          status={status}
        />
        <ProgressBar duration={duration} progress={progress} status={status} />
        <Meta meta={meta} />
      </Flex>
    </Box>
  );
}