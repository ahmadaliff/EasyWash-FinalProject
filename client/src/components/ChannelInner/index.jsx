import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { ChannelHeader, MessageInput, MessageList, Thread, Window, useChannelDeletedListener } from 'stream-chat-react';

import { ArrowBackIosNew } from '@mui/icons-material';
import { IconButton } from '@mui/material';

import classes from '@pages/ChatPage/style.module.scss';

const ChannelInner = ({ isMenuOpen, setIsMenuOpen }) => {
  const deleteListener = useChannelDeletedListener(null, () => setIsMenuOpen(true));

  useEffect(() => {
    deleteListener;
  }, [deleteListener]);

  return (
    <div className={classes.windowWrap}>
      <Window>
        <div className={`${classes.headerChannelWrap} str-chat__channel-header`}>
          {!isMenuOpen && (
            <IconButton className={classes.hamburgerButton} onClick={() => setIsMenuOpen(true)}>
              <ArrowBackIosNew />
            </IconButton>
          )}
          <ChannelHeader />
        </div>
        <MessageList messageActions={['edit', 'delete', 'react', 'quotes']} />
        <MessageInput />
      </Window>
      <div className={classes.thread}>
        <Thread />
      </div>
    </div>
  );
};

ChannelInner.propTypes = {
  isMenuOpen: PropTypes.bool,
  setIsMenuOpen: PropTypes.func,
};

export default ChannelInner;
