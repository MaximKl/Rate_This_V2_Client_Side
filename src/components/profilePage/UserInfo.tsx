import moment from 'moment';
import { useNavigation } from '../../hooks/use-navigation';
import {
  useDeleteFriendMutation,
  useGetLightFriendsQuery,
  useGetUserPageInfoQuery,
  useLazyGetUserFriendsQuery,
  useLazyGetUserSuggestionsQuery,
  usePostUserSuggestionMutation,
} from '../../store/apis/userApis';
import { Link } from 'react-router-dom';
import { IoPersonAddSharp, IoPersonRemoveSharp } from 'react-icons/io5';
import { FaHourglassEnd } from 'react-icons/fa';
import { ImCross, ImCheckmark } from 'react-icons/im';
import { useEffect, useState } from 'react';
import { SureMessage } from '../SureMessage';
import { Button } from '../ui/Button';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';
import { FaCrown } from 'react-icons/fa';
import { Loading } from '../../assets/Loading';
import { Friend } from '../../interfaces/user/Friend';
import { FaTrashAlt } from 'react-icons/fa';
import { useDeleteProfileByAdminMutation } from '../../store/apis/authorizationApis';
import { Pathes } from '../../store/Pathes';

const UserInfo: React.FC = () => {
  const {
    currentPath,
    basePath,
    navigate,
    user,
    unauthorizeUser,
    refetchUser,
  } = useNavigation();
  const { data, error } = useGetUserPageInfoQuery(currentPath.split('/')[3]);
  const [isNotFound, setIsNotFound] = useState(false);
  const lightFriends = useGetLightFriendsQuery(currentPath.split('/')[3]);
  const [getFriends, friendsResposnse] = useLazyGetUserFriendsQuery();
  const [getSuggestions, suggestionsResposnse] =
    useLazyGetUserSuggestionsQuery();
  const [postFriend, postFriendResponse] = usePostUserSuggestionMutation();
  const [deleteFriend, deleteFriendResponse] = useDeleteFriendMutation();
  const [isSureDelete, setIsSureDelete] = useState(false);
  const [isExpand, setIsExpand] = useState(false);
  const [descHeight, setDescHeight] = useState(0);
  const [showFriends, setShowFriends] = useState(false);
  const [friends, setFriends] = useState<Friend[] | undefined>();
  const [deleteProfile, deleteProfileResponse] =
    useDeleteProfileByAdminMutation();
  const [deleteAssurance, setDeleteAssurance] = useState(false);

  useEffect(() => {
    deleteProfileResponse.isError && unauthorizeUser();
    deleteProfileResponse.isSuccess && window.location.replace(`/RateThis`);
  }, [deleteProfileResponse]);

  useEffect(() => {
    friendsResposnse.data &&
      !friendsResposnse.isFetching &&
      !friendsResposnse.isLoading &&
      setFriends(friendsResposnse.data);
  }, [friendsResposnse]);

  useEffect(() => {
    if (error) {
      Pathes.getErrorCode(error) === 404 && setIsNotFound(true);
    }
  }, [error]);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    postFriendResponse.isError && unauthorizeUser();
  }, [postFriendResponse]);

  useEffect(() => {
    deleteFriendResponse.isError && unauthorizeUser();
  }, [deleteFriendResponse]);

  useEffect(() => {
    if (user) {
      if (currentPath.split('/')[3] === user.username) {
        getSuggestions(user.username);
      }
    }
  }, [user, currentPath]);

  useEffect(() => {
    if (showFriends) {
      setShowFriends(false);
      setFriends(undefined);
    }
  }, [currentPath]);

  const deleteBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        if (user && data) {
          deleteProfile({
            profileId: data.id,
            token: user.token,
          });
        }
        setDeleteAssurance(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  const renderFriends =
    friends &&
    friends.map((f) => {
      return (
        <div
          key={f.name}
          className="mb-3 flex min-w-[6rem] max-w-[6rem] flex-col pr-4"
        >
          <div className="flex w-full justify-center">
            <div
              className="max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[4rem] rounded-full bg-cover bg-center"
              style={{
                backgroundImage: `url(data:image/jpeg;base64,${f.avatar}`,
              }}
            ></div>
          </div>
          <div>
            <h1
              className="cursor-pointer truncate text-center text-base font-bold text-slate-900"
              title={f.name}
              onClick={() => {
                navigate(`/${basePath}/profile/${f.name}`);
              }}
            >
              <Link to={`/${basePath}/profile/${f.name}`}>{f.name}</Link>
            </h1>
          </div>
        </div>
      );
    });

  const unAppliedFriends =
    suggestionsResposnse.data &&
    suggestionsResposnse.data
      .filter((f) => !f.isApproved)
      .map((f) => {
        return (
          <div
            key={f.name}
            className="mb-3 flex min-w-[6rem] max-w-[6rem] flex-col pr-4"
          >
            <div className="relative flex w-full justify-center">
              <div
                className="max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[4rem] rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(data:image/jpeg;base64,${f.avatar}`,
                }}
              ></div>
              <div
                className="absolute top-0 right-0 cursor-pointer rounded-lg bg-slate-800 p-[2px] text-xl text-green-600 duration-150 hover:text-green-500"
                onClick={() => {
                  postFriend({
                    friendId: f.friendId,
                    user: user!,
                    type: 'approve',
                  });
                  sleep(1000).then(() => refetchUser());
                }}
              >
                <ImCheckmark title="Прийняти заявку" />
              </div>
              <div
                onClick={() => {
                  deleteFriend({
                    friendId: f.friendId,
                    user: user!,
                    type: 'deny',
                  });
                  sleep(1000).then(() => refetchUser());
                }}
                className="absolute bottom-0 right-0 cursor-pointer rounded-lg bg-slate-800 p-[2px] text-xl text-red-600 duration-150 hover:text-red-500"
              >
                <ImCross title="Відхилити заявку" />
              </div>
            </div>
            <div>
              <h1
                className="cursor-pointer truncate font-bold text-slate-900"
                title={f.name}
                onClick={() => {
                  navigate(`/${basePath}/profile/${f.name}`);
                }}
              >
                <Link to={`/${basePath}/profile/${f.name}`}>{f.name}</Link>
              </h1>
            </div>
          </div>
        );
      });

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        deleteFriend({ friendId: data!.id, user: user!, type: 'delete' });
        setIsSureDelete(false);
        sleep(1000).then(() => refetchUser());
      }}
    >
      Так, я впевнений
    </Button>
  );

  return (
    <>
      {isSureDelete && (
        <SureMessage
          actionBar={actionBar}
          onClose={setIsSureDelete}
          elementName={`видалити ${data!.nick} з друзів`}
        />
      )}
      <div className="flex w-full pb-5">
        <div className="min-w-[7%] max-w-[7%]"></div>
        <div className="flex min-w-[86%] max-w-[86%] flex-col">
          {data ? (
            <>
              <div className="relative mt-5 flex justify-center">
                <div
                  className="max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[4rem] rounded-full bg-cover bg-center
                   lg:max-h-[11rem]  lg:min-h-[11rem]  lg:min-w-[11rem]  lg:max-w-[11rem] "
                  style={{
                    backgroundImage: `url(data:image/jpeg;base64,${data.image}`,
                  }}
                ></div>
                {user && (
                  <>
                    {data.nick !== user.username && lightFriends.data && (
                      <div className=" absolute bottom-0 right-0">
                        {lightFriends.data.filter(
                          (f) => f.name === user.username && f.isApproved
                        ).length !== 0 ? (
                          <IoPersonRemoveSharp
                            title="Видалити з друзів"
                            className=" cursor-pointer text-3xl text-red-900 duration-150 hover:text-red-700"
                            onClick={() => {
                              setIsSureDelete(true);
                            }}
                          />
                        ) : (
                          <>
                            {lightFriends.data.filter(
                              (f) => f.name === user.username && !f.isApproved
                            ).length !== 0 ? (
                              <FaHourglassEnd
                                title="Очікує підтвердження (відмінити запрошення)"
                                className="cursor-pointer text-3xl text-orange-800 duration-150 hover:text-orange-600"
                                onClick={() => {
                                  setIsSureDelete(true);
                                }}
                              />
                            ) : (
                              <IoPersonAddSharp
                                onClick={() => {
                                  postFriend({
                                    friendId: data.id,
                                    user,
                                    type: 'add',
                                  });
                                }}
                                title="Додати до друзів"
                                className=" cursor-pointer text-3xl text-green-900 hover:text-green-800 "
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                    {user.role === 'ADMIN' && (
                      <FaTrashAlt
                        title="Видалити користувача"
                        className="absolute bottom-0 left-0 cursor-pointer text-3xl text-red-700 hover:text-red-600"
                        onClick={() => setDeleteAssurance(true)}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="mt-2 flex justify-center break-all rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 text-3xl font-bold">
                <span className=" text-slate-800">
                  {data.nick}{' '}
                  {data.role !== 'DEFAULT' && (
                    <FaCrown
                      title="Адміністратор"
                      className="inline cursor-pointer text-2xl text-fuchsia-800"
                    />
                  )}
                </span>
              </div>
              {data.description.length > 0 && (
                <div className="mt-2 rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 pt-2 text-lg font-medium text-slate-900/80">
                  <h1
                    ref={(e) => setDescHeight(e?.offsetHeight!)}
                    className={` overflow-hidden ${
                      isExpand ? '' : 'line-clamp-4'
                    }  whitespace-pre-wrap  break-words`}
                  >
                    <span className="font-bold text-slate-900">Про себе: </span>
                    {data.description}
                  </h1>

                  {descHeight >= 112 && (
                    <div className="mt-3 flex justify-center font-semibold text-fuchsia-900 duration-150 hover:text-fuchsia-800">
                      <h1
                        className="flex cursor-pointer select-none"
                        onClick={() => {
                          setIsExpand((e) => {
                            if (e) {
                              setDescHeight(112);
                              return false;
                            }
                            setDescHeight(113);
                            return true;
                          });
                        }}
                      >
                        <>
                          {isExpand ? (
                            <>
                              Згорнути
                              <AiFillCaretUp className="ml-[4px] mt-[6px] text-lg" />
                            </>
                          ) : (
                            <>
                              Розгорнути
                              <AiFillCaretDown className="ml-[4px] mt-[6px] text-lg" />
                            </>
                          )}
                        </>
                      </h1>
                    </div>
                  )}
                </div>
              )}
              <div className="mt-2 rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 pt-2 text-lg font-medium text-slate-900/80">
                <h1>
                  <span className="font-bold text-slate-900">
                    Дата народження:{' '}
                  </span>
                  {moment(data.birthday).format('D MMMM YYYY')}
                </h1>
              </div>
              <div className="mt-2 rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 pt-2 text-lg font-medium text-slate-900/80">
                <h1>
                  <span className="font-bold text-slate-900">
                    Дата реєстрації:{' '}
                  </span>
                  {moment(data.regDate).format('D MMMM YYYY')}
                </h1>
              </div>
              <div className="mt-2 rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 pt-2 text-lg font-medium text-slate-900/80">
                <h1>
                  <span className="font-bold text-slate-900">
                    Кількість скарг:{' '}
                  </span>
                  {data.report}
                </h1>
              </div>
              {user && suggestionsResposnse.data && (
                <>
                  {data.nick === user.username &&
                    suggestionsResposnse.data.length > 0 && (
                      <>
                        <div className="mt-2 rounded-lg border-b-4 border-slate-600/60 px-2 pb-1 pt-2 text-lg font-medium text-slate-900/80">
                          <h1>
                            <span className="font-bold text-slate-900">
                              Заявки у друзі (
                              {suggestionsResposnse.data?.length}) :{' '}
                            </span>
                          </h1>

                          <div className="mt-2 flex flex-wrap justify-evenly text-center">
                            {unAppliedFriends}
                          </div>
                        </div>
                      </>
                    )}
                </>
              )}
              <div
                className={`mt-2 text-lg ${
                  showFriends ? 'flex-col' : 'flex'
                } rounded-lg border-b-4 border-slate-600/60 px-2 pt-2 pb-2 text-lg font-medium text-slate-900/80`}
              >
                <span className="font-bold text-slate-900">
                  Друзі ({data.friendQuantity}) :
                </span>
                {showFriends ? (
                  <>
                    <div className="mt-2 flex flex-wrap justify-evenly text-center">
                      {friends ? (
                        renderFriends
                      ) : (
                        <svg>
                          <Loading hexColor="#e2e8f0" />
                        </svg>
                      )}
                    </div>
                    <span
                      onClick={() => {
                        setShowFriends(false);
                        setFriends(undefined);
                      }}
                      className="flex cursor-pointer select-none justify-center font-semibold text-fuchsia-900 duration-150 hover:text-fuchsia-800"
                    >
                      Сховати друзів
                      <AiFillCaretUp className="ml-[4px] mt-[6px] text-lg" />
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      setShowFriends(true);
                      getFriends(data.nick);
                    }}
                    className="flex cursor-pointer select-none pl-3 font-semibold text-fuchsia-900 duration-150 hover:text-fuchsia-800"
                  >
                    Показати друзів
                    <AiFillCaretDown className="ml-[4px] mt-[6px] text-lg" />
                  </span>
                )}
              </div>{' '}
              {deleteAssurance && (
                <SureMessage
                  onClose={setDeleteAssurance}
                  actionBar={deleteBar}
                  elementName={`видалити профіль користувача ${data.nick}.`}
                />
              )}
            </>
          ) : !isNotFound ? (
            <svg>
              <Loading hexColor="#e2e8f0" />
            </svg>
          ) : (
            <h1 className="select-none pt-64 text-center text-6xl font-bold text-slate-300/50">
              ТАКОГО КОРИСТУВАЧ НЕ ІСНУЄ
            </h1>
          )}
        </div>

        <div className="min-w-[7%] max-w-[7%]"></div>
      </div>
    </>
  );
};

export { UserInfo };
