import { Loading } from '../../assets/Loading';
import { useNavigation } from '../../hooks/use-navigation';
import { Friend } from '../../interfaces/user/Friend';
import { useGetUserFriendsQuery } from '../../store/apis/userApis';

interface FriendsListProps {
  setChoosenFriend: React.Dispatch<React.SetStateAction<Friend | undefined>>;
  choosenFriend: Friend | undefined;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[] | undefined>>;
  lastMessages: ChatMessage[];
}

const FriendsList: React.FC<FriendsListProps> = ({
  setChoosenFriend,
  choosenFriend,
  setMessages,
  lastMessages,
}) => {
  const { user } = useNavigation();
  const friends = useGetUserFriendsQuery(user!?.username);

  const renderFriends =
    friends.data &&
    friends.data.map((f) => {
      return (
        <div
          key={f.name}
          className={`p-1 ${
            choosenFriend && choosenFriend.name === f.name
              ? 'bg-slate-500'
              : 'bg-slate-600'
          } min-w-full flex rounded mb-4 cursor-pointer hover:bg-slate-500 duration-150`}
          onClick={() => {
            if (choosenFriend) {
              f.name !== choosenFriend.name && setMessages([]);
              f.name !== choosenFriend.name && setChoosenFriend(f);
            }
            setChoosenFriend(f);
          }}
        >
          <div className="min-w-fit flex">
            <div
              className="bg-cover bg-center rounded-full min-w-[50px] min-h-[50px] max-w-[50px] max-h-[50px]"
              style={{
                backgroundImage: `url(data:image/jpeg;base64,${f.avatar}`,
              }}
            ></div>
          </div>
          <div className="min-w-[3%]"></div>
          <div className="min-w-[70%] flex-col h-fit">
            <div className="overflow-hidden ">
              <h1
                title={f.name}
                className=" font-semibold text-slate-200 truncate"
              >
                {f.name}
              </h1>
            </div>
            <div className="overflow-hidden ">
              <h1 className=" text-gray-400 truncate">
                {lastMessages.filter(
                  (m) =>
                    (m.messageFrom === f.friendId &&
                      m.messageTo === user?.id) ||
                    (m.messageTo === f.friendId && m.messageFrom === user?.id)
                ).length > 0
                  ? lastMessages
                      .filter(
                        (m) =>
                          (m.messageFrom === f.friendId &&
                            m.messageTo === user?.id) ||
                          (m.messageTo === f.friendId &&
                            m.messageFrom === user?.id)
                      )
                      .slice()
                      .sort((m1, m2) => {
                        return (
                          new Date(m2.messageTime).getTime() -
                          new Date(m1.messageTime).getTime()
                        );
                      })[0].messageBody
                  : ''}
              </h1>
            </div>
          </div>
        </div>
      );
    });

  return (
    <div className="mt-5 w-full flex justify-center ">
      <div className="min-w-[10%]"></div>
      <div className="min-w-[80%]">
        {friends.isSuccess ? (
          renderFriends
        ) : (
          <svg>
            <Loading hexColor="#e2e8f0" />
          </svg>
        )}
      </div>
      <div className="min-w-[10%]"></div>
    </div>
  );
};

export { FriendsList };
