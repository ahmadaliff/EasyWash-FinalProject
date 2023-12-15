import PropTypes from 'prop-types';
import { StreamChat } from 'stream-chat';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Chat, Channel, ChannelList } from 'stream-chat-react';

import ChannelInner from '@components/ChannelInner';

import config from '@config/index';

import { selectTokenStream } from '@pages/ChatPage/selectors';
import { selectTheme } from '@containers/App/selectors';
import { actionGetTokenMessage } from '@pages/ChatPage/actions';
import { selectUser } from '@containers/Client/selectors';
import { showPopup } from '@containers/App/actions';

import classes from '@pages/ChatPage/style.module.scss';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage = ({ theme, user, tokenChat }) => {
  const dispatch = useDispatch();
  const [chatClient, setChatClient] = useState(null);
  const [isMenuopen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    dispatch(actionGetTokenMessage());
    const initChat = async () => {
      if (chatClient === null) {
        const client = StreamChat.getInstance(config.api.streamKey);
        try {
          await client.connectUser(
            {
              id: JSON.stringify(user?.id),
              name: user?.fullName,
              image: `${config.api.server}${user?.imagePath}`,
            },
            tokenChat
          );
          setChatClient(client);
        } catch (error) {
          dispatch(showPopup());
        }
      }
    };
    if (tokenChat) {
      initChat();
    }
    return () => {
      const disconnect = async () => {
        if (chatClient) await chatClient.disconnectUser();
      };
      disconnect();
    };
  }, [chatClient, dispatch, tokenChat, user]);

  return (
    <main className={classes.mainWrap}>
      {chatClient?.userID && (
        <div className={classes.chatWrap}>
          <Chat client={chatClient} theme={`str-chat__theme-${theme}`}>
            <div className={`${classes.channelListWrap} ${isMenuopen && classes.open}`}>
              <div className={`${classes.channelList} str-chat str-chat__channel-list str-chat__theme-${theme}`}>
                <div onClick={() => setIsMenuOpen(false)}>
                  <ChannelList
                    filters={{ members: { $in: [JSON.stringify(user?.id)] } }}
                    sort={{ last_message_at: -1 }}
                    showChannelSearch
                  />
                </div>
              </div>
            </div>
            <div className={`${classes.chatBox} ${!isMenuopen && classes.open}`}>
              <Channel>
                <ChannelInner isMenuOpen={isMenuopen} setIsMenuOpen={setIsMenuOpen} />
              </Channel>
            </div>
          </Chat>
        </div>
      )}
    </main>
  );
};

ChatPage.propTypes = {
  tokenChat: PropTypes.string,
  user: PropTypes.object,
  theme: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  tokenChat: selectTokenStream,
  theme: selectTheme,
});

export default connect(mapStateToProps)(ChatPage);
