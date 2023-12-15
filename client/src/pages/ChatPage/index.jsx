import PropTypes from 'prop-types';
import { StreamChat } from 'stream-chat';
import { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Chat, Channel, ChannelList } from 'stream-chat-react';

import ChannelInner from '@components/ChannelInner';

import config from '@config/index';

import { selectProfile, selectTokenStream } from '@pages/ChatPage/selectors';
import { selectTheme } from '@containers/App/selectors';
import { actionGetProfile, actionGetTokenMessage } from '@pages/ChatPage/actions';
import { showPopup } from '@containers/App/actions';

import classes from '@pages/ChatPage/style.module.scss';
import 'stream-chat-react/dist/css/v2/index.css';

const ChatPage = ({ theme, profile, tokenChat }) => {
  const dispatch = useDispatch();
  const [chatClient, setChatClient] = useState(null);
  const [isMenuopen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    if (!profile) {
      dispatch(actionGetProfile());
    }
    if (!tokenChat) {
      dispatch(actionGetTokenMessage());
    }
    const initChat = async () => {
      if (chatClient === null) {
        const client = StreamChat.getInstance(config.api.streamKey);
        try {
          await client.connectUser(
            {
              id: JSON.stringify(profile?.id),
              name: profile?.fullName,
              image: `${config.api.server}${profile?.imagePath}`,
            },
            tokenChat
          );
          setChatClient(client);
        } catch (error) {
          dispatch(showPopup());
        }
      }
    };
    if (tokenChat && profile) {
      initChat();
    }
    return () => {
      const disconnect = async () => {
        await chatClient.disconnectUser();
      };
      if (chatClient) disconnect();
    };
  }, [chatClient, dispatch, profile, tokenChat]);

  return (
    <main className={classes.mainWrap}>
      {chatClient?.userID && (
        <div className={classes.chatWrap}>
          <Chat client={chatClient} theme={`str-chat__theme-${theme}`}>
            <div className={`${classes.channelListWrap} ${isMenuopen && classes.open}`}>
              <div className={`${classes.channelList} str-chat str-chat__channel-list str-chat__theme-${theme}`}>
                <div onClick={() => setIsMenuOpen(false)}>
                  <ChannelList
                    filters={{ members: { $in: [JSON.stringify(profile?.id)] } }}
                    sort={{ last_message_at: -1 }}
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
  profile: PropTypes.object,
  theme: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  profile: selectProfile,
  tokenChat: selectTokenStream,
  theme: selectTheme,
});

export default connect(mapStateToProps)(ChatPage);