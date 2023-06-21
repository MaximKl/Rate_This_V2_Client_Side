import moment from 'moment';
import { Review } from '../../interfaces/product/Review';
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiFillDislike,
  AiFillLike,
} from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  useDeleteUserReviewByAdminMutation,
  usePostUserReactionMutation,
  usePostUserReportMutation,
} from '../../store/apis/productApis';
import { useNavigation } from '../../hooks/use-navigation';
import { useEffect, useState, useRef } from 'react';
import { ReviewDropdown } from './ReviewDropdown';
import { Report } from '../../interfaces/product/Report';
import { SureMessage } from '../SureMessage';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface CommonReviewProps {
  review: Review;
  isLike: boolean;
  isDislike: boolean;
  productId: number;
  report: Report | undefined;
  productType: string;
}

interface RefProp {
  height: number | null | undefined;
}

const CommonReview: React.FC<CommonReviewProps> = ({
  review,
  isLike,
  isDislike,
  productId,
  report,
  productType,
}) => {
  const { user, unauthorizeUser, isAuthorized, navigate, basePath } =
    useNavigation();
  const [addReaction, response] = usePostUserReactionMutation();
  const [addReport, reportResponse] = usePostUserReportMutation();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [reportMessage, setReportMessage] = useState('');
  const [openReport, setIsOpenReport] = useState(false);
  const [newLike, setNewLike] = useState(false);
  const [newDislike, setNewDislike] = useState(false);
  const [likeQuantity, setLikeQuantity] = useState(-1);
  const [dislikeQuantity, setDislikeQuantity] = useState(-1);
  const [isExpand, setIsExpand] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteReview, deleteResponse] = useDeleteUserReviewByAdminMutation();

  const reviewEl = useRef<RefProp>({ height: 0 });

  useEffect(() => {
    deleteResponse.isError && unauthorizeUser();
  }, [deleteResponse]);

  useEffect(() => {
    setDislikeQuantity(review.dislike);
    setLikeQuantity(review.like);
    setNewDislike(isDislike);
    setNewLike(isLike);
  }, [isLike, isDislike, review.like, review.dislike]);

  useEffect(() => {
    response.isError && unauthorizeUser();
  }, [response]);

  useEffect(() => {
    reportResponse.isError && unauthorizeUser();
  }, [reportResponse]);

  var isValid =
    reportMessage.replaceAll(' ', '') !== '' &&
    reportMessage.length > 10 &&
    reportMessage.length < 2001;

  const actionBar = (
    <Button
      success={isValid}
      rounded
      secondary={!isValid}
      disabled={!isValid}
      className={`${
        isValid
          ? 'cursor-pointer duration-200 hover:brightness-110'
          : 'cursor-default'
      } ml-2 text-[12px] shadow shadow-black/30 sm:ml-5 sm:text-base`}
      onClick={() => {
        addReport({
          reportBody: reportMessage,
          user: user!,
          reviewId: review.id,
        });
        setIsOpenReport(false);
      }}
    >
      Відправити скаргу
    </Button>
  );

  const deleteBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        if (user) {
          deleteReview({ reviewId: review.id, user: user });
        }

        setIsDelete(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  return (
    <>
      {openReport && (
        <SureMessage
          actionBar={actionBar}
          onClose={setIsOpenReport}
          isReport
          message={reportMessage}
          setMessage={setReportMessage}
        ></SureMessage>
      )}
      {isDelete && (
        <SureMessage
          actionBar={deleteBar}
          onClose={setIsDelete}
          elementName={`видалити текстову рецензію користувача ${review.name}?`}
        ></SureMessage>
      )}
      <div
        className={`${
          report ? 'bg-yellow-300 opacity-70' : 'bg-slate-300 '
        } mb-10 flex min-w-[16rem] max-w-[90%] flex-col rounded px-2 pb-4 pt-2 shadow shadow-black/50 sm:min-w-[40rem] xl:max-w-[60%]`}
      >
        <div className="relative flex justify-center pb-4 text-slate-700 ">
          <BsThreeDotsVertical
            className="absolute right-0 cursor-pointer text-2xl"
            onClick={() => setIsDropdownMenuOpen((val) => (val ? false : true))}
          />
          {isDropdownMenuOpen && (
            <ReviewDropdown
              setIsOpen={setIsDropdownMenuOpen}
              isOpen={isDropdownMenuOpen}
              username={review.name}
              isUserReview={false}
              isAlreadyReported={report ? true : false}
              isReport={setIsOpenReport}
              isAdminDelete={setIsDelete}
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
              className="background ml-2 max-h-[4rem] min-h-[4rem] min-w-[4rem] max-w-[4rem] rounded-full bg-cover bg-center
                   lg:max-h-[6rem]  lg:min-h-[6rem]  lg:min-w-[6rem]  lg:max-w-[6rem] "
              style={{
                backgroundImage: `url(data:image/jpeg;base64,${review.photo}`,
              }}
            ></div>
          </div>

          <div
            className="flex flex-col overflow-hidden break-words pr-5"
            ref={(e) => (reviewEl.current.height = e?.offsetHeight)}
          >
            <div
              className={`whitespace-pre-wrap pl-2 text-sm sm:pl-5 sm:text-base`}
            >
              <h1
                className={`overflow-hidden ${
                  isExpand ? '' : 'line-clamp-[5]'
                } `}
              >
                {review.body}
              </h1>
            </div>
            {report && (
              <div className="mt-5 pl-2 sm:pl-5">
                <h1 className="border-t-4 border-slate-600 text-sm italic sm:text-base">
                  {report.reportBody}
                </h1>
              </div>
            )}
          </div>
        </div>

        {reviewEl.current.height! >= 120 && (
          <div className="mt-3 flex justify-center text-lg font-bold text-fuchsia-800">
            <h1
              className="flex cursor-pointer select-none"
              onClick={() => {
                setIsExpand((e) => {
                  if (e) {
                    reviewEl.current.height = 120;
                    return false;
                  }
                  reviewEl.current.height = 121;
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

        <div className="relative flex w-full justify-start pt-5 pl-5 sm:justify-center sm:pl-0">
          <div className="flex pr-2 md:pr-5">
            <h1 className="cursor-default select-none text-sm md:text-xl">
              {likeQuantity}
            </h1>
            <AiFillLike
              className={` ${newLike ? 'text-green-700' : 'text-slate-800'} ${
                user ? 'cursor-pointer' : 'cursor-default'
              } text-base md:text-2xl`}
              onClick={() => {
                if (isAuthorized) {
                  addReaction({
                    user,
                    isLike: 1,
                    reviewId: review.id,
                    productId,
                  });
                  if (newDislike) {
                    setNewDislike(false);
                    setNewLike(true);
                    setDislikeQuantity((dis) => dis - 1);
                    setLikeQuantity((like) => like + 1);
                  } else {
                    setNewLike((like) => {
                      if (like) {
                        setLikeQuantity((like) => like - 1);
                        return false;
                      } else {
                        setLikeQuantity((like) => like + 1);
                        return true;
                      }
                    });
                  }
                }
              }}
            />
          </div>
          <div className="flex">
            <h1 className="cursor-default select-none text-sm md:text-xl">
              {dislikeQuantity}
            </h1>
            <AiFillDislike
              className={`${newDislike ? 'text-red-700' : 'text-slate-800'} ${
                user ? 'cursor-pointer' : 'cursor-default'
              } text-base md:text-2xl`}
              onClick={() => {
                if (isAuthorized) {
                  addReaction({
                    user,
                    isLike: 0,
                    reviewId: review.id,
                    productId,
                  });
                  if (newLike) {
                    setNewLike(false);
                    setNewDislike(true);
                    setDislikeQuantity((dis) => dis + 1);
                    setLikeQuantity((like) => like - 1);
                  } else {
                    setNewDislike((dislike) => {
                      if (dislike) {
                        setDislikeQuantity((dis) => dis - 1);
                        return false;
                      } else {
                        setDislikeQuantity((dis) => dis + 1);
                        return true;
                      }
                    });
                  }
                }
              }}
            />
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
    </>
  );
};
export { CommonReview };
