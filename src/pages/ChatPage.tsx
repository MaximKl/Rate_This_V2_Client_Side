import SockJS from 'sockjs-client';
import { FriendsList } from '../components/chatPage/FriendsList';
import { MessageWindow } from '../components/chatPage/MessageWindow';
import { Client, Frame, Message, over } from 'stompjs';
import { useNavigation } from '../hooks/use-navigation';
import { useEffect, useState } from 'react';
import { Friend } from '../interfaces/user/Friend';
import { useLazyGetAllLastMessagesQuery } from '../store/apis/chatApis';

const ChatPage: React.FC = () => {
  const { user, refetchUser, chatValidation, socket, setSocket } =
    useNavigation();
  const [chatWithFriend, setFriend] = useState<Friend | undefined>(undefined);
  const [allChatMessages, setAllChatMessages] = useState<
    ChatMessage[] | undefined
  >();
  const [receivedMessage, setReceivedMessage] = useState<ChatMessage>();
  const [lastMessages, setLastMessages] = useState<ChatMessage[] | undefined>();
  const [stompClient, setStompClient] = useState<Client | undefined>();
  const [getLastMessages, lastMessagesResponse] =
    useLazyGetAllLastMessagesQuery();

  useEffect(() => {
    refetchUser();
  }, []);

  useEffect(() => {
    lastMessagesResponse.isSuccess &&
      lastMessagesResponse.data &&
      setLastMessages(lastMessagesResponse.data);
  }, [lastMessagesResponse]);

  useEffect(() => {
    if (receivedMessage) {
      if (chatWithFriend) {
        if (chatWithFriend.friendId === receivedMessage.messageFrom) {
          allChatMessages
            ? setAllChatMessages([...allChatMessages, receivedMessage])
            : setAllChatMessages([receivedMessage]);
        }
        if (user!.id === receivedMessage.messageFrom) {
          allChatMessages
            ? setAllChatMessages([...allChatMessages, receivedMessage])
            : setAllChatMessages([receivedMessage]);
        }
      }
      setLastMessages([...lastMessages!, receivedMessage]);
    }
  }, [receivedMessage]);

  const onConnected = () => {
    stompClient!.subscribe(`/chat/${user!.id}/private`, onReceive);
    console.log(`${user?.username} connected`);
  };

  const onReceive = (p: Message) => {
    if (p) {
      const sendedMessage: ChatMessage = JSON.parse(p.body);
      setReceivedMessage(sendedMessage);
    }
  };

  const onError = (err: string | Frame) => {
    console.log(err);
  };

  const connectToChat = () => {
    setSocket(new SockJS(`http://localhost:8004/chat-socket`));
  };

  useEffect(() => {
    socket && setStompClient(over(socket));
  }, [socket]);

  useEffect(() => {
    if (stompClient) stompClient.debug = (f) => f;
    stompClient && stompClient.connect({}, onConnected, onError);
  }, [stompClient]);

  useEffect(() => {
    if (chatValidation === 1) {
      connectToChat();
      getLastMessages(user!);
    }
    if (chatValidation === 0) {
      window.location.replace('/RateThis');
    }
  }, [chatValidation]);

  return (
    <>
      {chatValidation === 1 && stompClient && lastMessages && (
        <div className="flex h-[100%] w-full pt-[64px]">
          <div className="scrollbar max-h-[100%] w-[30%] overflow-y-auto bg-slate-700">
            <FriendsList
              lastMessages={lastMessages}
              setMessages={setAllChatMessages}
              choosenFriend={chatWithFriend}
              setChoosenFriend={setFriend}
            />
          </div>
          <div className="max-h-[100%] w-[70%] bg-slate-500">
            <MessageWindow
              messages={allChatMessages}
              setMessages={setAllChatMessages}
              stompClient={stompClient!}
              chatWithFriend={chatWithFriend}
            />
          </div>
        </div>
      )}
    </>
  );
};

export { ChatPage };
