import { useEffect, useState } from 'react';
import { useNavigation } from '../../hooks/use-navigation';
import { Friend } from '../../interfaces/user/Friend';
import { useLazyGetAllChatMessagesQuery } from '../../store/apis/chatApis';
import { Button } from '../ui/Button';
import { Loading } from '../../assets/Loading';
import moment from 'moment';
import { Client } from 'stompjs';

interface MessageWindowProps {
  chatWithFriend: Friend | undefined;
  stompClient: Client;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[] | undefined>>;
  messages: ChatMessage[] | undefined;
}

const MessageWindow: React.FC<MessageWindowProps> = ({
  chatWithFriend,
  stompClient,
  setMessages,
  messages,
}) => {
  const { user, unauthorizeUser } = useNavigation();
  const [getChatMessages, messagesResponse] = useLazyGetAllChatMessagesQuery();
  const [textMessageValue, setMessageValue] = useState('');

  useEffect(() => {
    if (chatWithFriend) {
      getChatMessages({ friendId: chatWithFriend.friendId, user: user! });
    }
  }, [chatWithFriend]);

  useEffect(() => {
    messagesResponse.data && setMessages(messagesResponse.data);
  }, [messagesResponse.data]);

  useEffect(() => {
    messagesResponse.isError && unauthorizeUser();
    messagesResponse.isError && window.location.replace('/RateThis');
  }, [messagesResponse]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //@ts-ignore
    e.target.style.height = 'inherit';
    //@ts-ignore
    const computed = window.getComputedStyle(e.target);

    //@ts-ignore
    const height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding'), 10) +
      //@ts-ignore
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue('padding'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10);
    //@ts-ignore
    e.target.style.height = `${height}px`;
  };

  var isValid =
    textMessageValue.replaceAll(' ', '') !== '' &&
    textMessageValue.length >= 1 &&
    textMessageValue.length <= 2000;

  const renderMessages =
    messages &&
    messages.map((m) => {
      return (
        <div
          key={m.messageId}
          className={`flex min-w-full ${
            user!.id === m.messageFrom && 'justify-end'
          }`}
        >
          <div
            className={`my-2 flex w-fit min-w-fit max-w-full flex-col break-words rounded-xl ${
              user!.id === m.messageFrom ? 'bg-violet-800' : 'bg-slate-700'
            } px-2 pt-1 pb-2`}
          >
            <h1 className="h-fit text-center font-semibold text-slate-400">
              {user!.id === m.messageFrom
                ? user!.username
                : chatWithFriend!.name}
            </h1>

            <div className="flex">
              <div
                className="max-h-[35px] min-h-[35px] min-w-[35px] max-w-[35px] rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(data:image/jpeg;base64,${
                    user!.id === m.messageFrom
                      ? user!.avatar
                      : chatWithFriend!.avatar
                  }`,
                }}
              ></div>
              <div className="min-w-[1rem]"></div>
              <div className="flex w-fit items-center ">
                <h1 className="text-slate-300 ">{m.messageBody}</h1>
              </div>
            </div>
            <h1 className="mt-2 text-right text-xs text-slate-400/70">
              {moment(m.messageTime).format('HH:mm | DD-MMM-YYYY ')}
            </h1>
          </div>
        </div>
      );
    });

  return (
    <div className="flex h-full w-full">
      {chatWithFriend ? (
        <div className="scrollbar2 flex h-full w-full flex-col-reverse overflow-x-auto px-16">
          <div className="flex max-h-fit w-full pb-3">
            <div className="flex max-h-fit min-w-[80%] flex-col items-start">
              <div className="w-full">
                <textarea
                  placeholder="Ваше повідомлення"
                  className="textAreaScroll max-h-[17rem] min-h-[5rem] min-w-full resize-none rounded-lg bg-slate-200 p-1 text-slate-700 outline-none"
                  onKeyUp={(e) => {
                    handleKeyDown(e);
                  }}
                  onChange={(e) => setMessageValue(e.target.value)}
                  value={textMessageValue}
                ></textarea>
              </div>
              <div className="w-full pt-1 text-right">
                <h1
                  className={` font-bold ${
                    textMessageValue.length >= 2000
                      ? 'text-red-800'
                      : 'text-slate-800'
                  }`}
                >
                  {textMessageValue.length}/2000
                </h1>
              </div>
            </div>

            <div className="mb-5 flex min-w-[20%] items-center justify-center ">
              <Button
                success={isValid}
                secondary={!isValid}
                disabled={!isValid}
                rounded
                className={`${
                  isValid ? 'cursor-pointer' : 'cursor-not-allowed'
                } text-sm duration-150 hover:brightness-105 lg:text-lg`}
                onClick={() => {
                  stompClient.send(
                    '/app/send-message',
                    { token: user!.token },
                    JSON.stringify({
                      body: textMessageValue,
                      toUserId: chatWithFriend.friendId,
                    })
                  );
                  setMessageValue('');
                }}
              >
                Відправити
              </Button>
            </div>
          </div>
          {!messagesResponse.isFetching &&
          !messagesResponse.isLoading &&
          messagesResponse.isSuccess &&
          messages ? (
            <div className="mb-10">{renderMessages}</div>
          ) : (
            <svg>
              <Loading hexColor="#e2e8f0" />
            </svg>
          )}
        </div>
      ) : (
        <div className="flex min-h-full w-full items-center justify-center text-6xl font-bold uppercase text-slate-400">
          <div className="w-full">
            <h1 className="text-center">Оберіть чат</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export { MessageWindow };
