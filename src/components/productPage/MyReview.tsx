import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { Review } from '../../interfaces/product/Review';
import { Button } from '../ui/Button';
import moment from 'moment';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  usePostUserReviewMutation,
  useUpdateUserReviewMutation,
} from '../../store/apis/productApis';
import { useNavigation } from '../../hooks/use-navigation';
import { useEffect, useState } from 'react';
import { ReviewDropdown } from './ReviewDropdown';
import { useDeleteUserReviewMutation } from '../../store/apis/productApis';
import { SureMessage } from '../SureMessage';
import { Link } from 'react-router-dom';

interface MyReviewProps {
  review: Review | undefined;
  productType: string;
  productId: number;
}

const MyReview: React.FC<MyReviewProps> = ({
  review,
  productType,
  productId,
}) => {
  const { user, unauthorizeUser, navigate, basePath } = useNavigation();
  const [sendReview, sendResponse] = usePostUserReviewMutation();
  const [message, setMessage] = useState('');
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [deleteReview, deleteResponse] = useDeleteUserReviewMutation();
  const [updateReview, updateResponse] = useUpdateUserReviewMutation();

  useEffect(() => {
    sendResponse.isError && unauthorizeUser();
  }, [sendResponse]);

  useEffect(() => {
    deleteResponse.isError && unauthorizeUser();
  }, [deleteResponse]);

  useEffect(() => {
    updateResponse.isError && unauthorizeUser();
  }, [updateResponse]);

  useEffect(() => {
    review ? setMessage(review.body) : setMessage('');
  }, [review]);

  var isValid =
    message.replaceAll(' ', '') !== '' &&
    message.length > 20 &&
    message.length < 5001;

  var background = '';
  if (productType === 'FILM') {
    background = 'bg-sky-300';
  }
  if (productType === 'BOOK') {
    background = 'bg-emerald-400';
  }
  if (productType === 'GAME') {
    background = 'bg-rose-300';
  }

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        deleteReview({ productId, user: user! });
        setIsDelete(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  return (
    <>
      {isDelete && (
        <SureMessage
          actionBar={actionBar}
          onClose={setIsDelete}
          elementName="видалити свою текстову рецензію?"
        ></SureMessage>
      )}
      {review && !isUpdate ? (
        <div className="flex min-w-[16rem] max-w-[90%] flex-col items-center sm:min-w-[40rem] xl:max-w-[65%]">
          <h1 className=" mb-9 border-b-4 pb-1 text-center text-4xl font-semibold text-slate-200">
            Ваш відгук
          </h1>
          <div
            className={`${background} mb-10 flex w-full flex-col rounded px-2 pb-4 pt-2 shadow shadow-black/50`}
          >
            <div className="relative flex justify-center pb-4 text-slate-700 ">
              <BsThreeDotsVertical
                onClick={() => {
                  setIsDropdownMenuOpen((val) => (val ? false : true));
                }}
                className="absolute right-0 cursor-pointer text-2xl"
              />
              {isDropdownMenuOpen && (
                <ReviewDropdown
                  setIsOpen={setIsDropdownMenuOpen}
                  isOpen={isDropdownMenuOpen}
                  isUserReview
                  isDelete={setIsDelete}
                  isUpdate={setIsUpdate}
                  username={review.name}
                />
              )}
              <Link
                to={`/${basePath}/profile/${
                  review.name
                }/${productType.toLocaleLowerCase()}/${productId}`}
                onClick={() => {
                  navigate(
                    `/${basePath}/profile/${
                      review.name
                    }/${productType.toLocaleLowerCase()}/${productId}`
                  );
                }}
              >
                <h1
                  title={review.name}
                  className="w-fit cursor-pointer truncate border-b-2 border-slate-800 pr-4 text-lg font-bold lg:p-0"
                >
                  {review.name}
                </h1>
              </Link>
            </div>
            <div className="flex">
              <div className="hidden items-center sm:flex">
                <div
                  className="ml-2 max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[4rem] rounded-full bg-cover bg-center
                   lg:max-h-[6rem]  lg:min-h-[6rem]  lg:min-w-[6rem]  lg:max-w-[6rem] "
                  style={{
                    backgroundImage: `url(data:image/jpeg;base64,${review.photo}`,
                  }}
                ></div>
              </div>

              <div className="flex flex-col overflow-hidden break-words pr-5">
                <div className="whitespace-pre-wrap pl-2 text-sm sm:pl-5 sm:text-base">
                  <h1>{review.body}</h1>
                </div>
              </div>
            </div>
            <div className="relative flex w-full justify-start pt-5 sm:justify-center">
              <div className="flex pr-2 md:pr-5">
                <h1 className=" cursor-default select-none text-sm opacity-40 md:text-xl">
                  {review.like}
                </h1>
                <AiFillLike className="text-base text-slate-800 opacity-40 md:text-2xl" />
              </div>
              <div className="flex">
                <h1 className="cursor-default select-none text-sm opacity-40 md:text-xl">
                  {review.dislike}
                </h1>
                <AiFillDislike className="text-base text-slate-800 opacity-40 md:text-2xl" />
              </div>
              <div className="absolute right-0 bottom-0 text-right text-[10px] text-slate-500 md:text-sm">
                <h1>
                  Додано: {moment(review.time).format('HH:mm | DD-MMM-YYYY ')}
                </h1>
                {review.isEdit && (
                  <h1 className="text-left">
                    Відредаговано:{' '}
                    {moment(review.editTime).format('HH:mm | DD-MMM-YYYY ')}
                  </h1>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-[60%] lg:w-[30%] ">
            <textarea
              placeholder="Напишіть свою рецензію (мінімум 20 символів)"
              className="min-h-[8rem] w-full rounded bg-slate-300 px-2 text-left shadow shadow-black/50 outline-none placeholder:text-slate-500 sm:h-24"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            ></textarea>
            <h1
              className={`mr-4 text-right text-base font-bold ${
                message.length > 5000 || message.length < 21
                  ? 'text-red-600'
                  : 'text-slate-900'
              }`}
            >
              {message.length}/5000
            </h1>
          </div>
          <div className="mb-8 flex flex-col items-center justify-center">
            <Button
              success={isValid}
              rounded
              secondary={!isValid}
              disabled={!isValid}
              className={`${
                isValid
                  ? 'cursor-pointer duration-200 hover:brightness-110'
                  : 'cursor-not-allowed'
              } ml-2 text-[12px] shadow shadow-black/30 sm:ml-5 sm:text-base`}
              onClick={() => {
                if (isUpdate) {
                  updateReview({
                    message,
                    productId,
                    user: user!,
                    reviewId: review?.id!,
                  });
                  setIsUpdate(false);
                } else {
                  sendReview({
                    review: {
                      id: 0,
                      body: message,
                      like: 0,
                      dislike: 0,
                      time: new Date(),
                      userId: user!.id,
                      productId,
                    },
                    user: user!,
                  });
                }
              }}
            >
              Відправити
            </Button>
            {isUpdate && (
              <Button
                rounded
                danger
                className={`mt-5 ml-2 cursor-pointer text-[12px] shadow shadow-black/30 duration-200 hover:brightness-110 sm:ml-5 sm:text-xs`}
                onClick={() => {
                  setIsUpdate(false);
                }}
              >
                Відмінити редагування
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export { MyReview };
