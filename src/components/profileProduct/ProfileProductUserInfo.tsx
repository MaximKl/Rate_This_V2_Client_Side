import { AiFillDislike, AiFillLike } from 'react-icons/ai';
import { useEstimateColor } from '../../hooks/use-estimate-color';
import { useNavigation } from '../../hooks/use-navigation';
import { FullProduct } from '../../interfaces/product/profileProduct/FullProduct';
import moment from 'moment';
import { MdReport } from 'react-icons/md';
import { Button } from '../ui/Button';
import { SureMessage } from '../SureMessage';
import { useEffect, useState } from 'react';
import {
  useGetUserReportsQuery,
  useLazyGetUserReactionsQuery,
  usePostUserReactionMutation,
  usePostUserReportMutation,
} from '../../store/apis/productApis';
import { Report } from '../../interfaces/product/Report';

interface ProfileProductUserInfoProps {
  product: FullProduct;
}

const ProfileProductUserInfo: React.FC<ProfileProductUserInfoProps> = ({
  product,
}) => {
  const { currentPath, user, unauthorizeUser } = useNavigation();
  const { chooseColor } = useEstimateColor();
  const profile = currentPath.split('/')[3];
  const [reportMessage, setReportMessage] = useState('');
  const [openReport, setIsOpenReport] = useState(false);
  const [report, setReport] = useState<Report>();
  const [newLike, setNewLike] = useState(false);
  const [newDislike, setNewDislike] = useState(false);
  const [likeQuantity, setLikeQuantity] = useState(product.reviewLikes);
  const [dislikeQuantity, setDislikeQuantity] = useState(
    product.reviewDislikes
  );

  const [addReport, reportResponse] = usePostUserReportMutation();
  const [addReaction, reactionResponse] = usePostUserReactionMutation();
  const [getReactions, getReactionsResponse] = useLazyGetUserReactionsQuery();
  const reports = useGetUserReportsQuery(user);

  useEffect(() => {
    reportResponse.isError && unauthorizeUser();
  }, [reportResponse]);

  useEffect(() => {
    reactionResponse.isError && unauthorizeUser();
  }, [reactionResponse]);

  useEffect(() => {
    user && getReactions(user);
    if (!user) {
      report && setReport(undefined);
      newDislike && setNewDislike(false);
      newLike && setNewLike(false);
    }
  }, [user]);

  useEffect(() => {
    if (getReactionsResponse.data) {
      getReactionsResponse.data.forEach((rr) => {
        if (rr.reviewId === product.reviewId)
          rr.isLike ? setNewLike(true) : setNewDislike(true);
      });
    }
  }, [getReactionsResponse]);

  useEffect(() => {
    if (user) {
      if (reports.data) {
        reports.data.forEach(
          (r) => r.reviewId === product.reviewId && setReport(r)
        );
      }
    }
  }, [reports]);

  const nameFields = (fieldName: string) => {
    return (
      <h1 className="pb-4">
        <span className="border-b-2 border-zinc-700">{fieldName}</span>
      </h1>
    );
  };

  const fieldCommonEstimates = (estimate: number) => {
    return (
      <h1 className={`${chooseColor(estimate)} pb-4 pl-2`}>
        <span className=" border-b-2 border-zinc-700">{estimate}</span>
      </h1>
    );
  };

  const marks = (
    <div className="relative flex w-full">
      <div className=" absolute -bottom-4 right-0">
        <span className=" text-sm text-slate-600/80">
          Оцінено: {moment(product.rateDate).format('HH:mm | DD-MMM-YYYY ')}
        </span>
      </div>
      <div className="w-[55%]">
        <div className={`text-right`}>
          <h1 className="truncate pb-3">
            <span className="text-[9px] font-bold text-slate-800  sm:text-xs md:text-xl">
              Середні оцінки усіх користувачів
            </span>
          </h1>
        </div>

        <div className="flex w-full justify-end text-xs text-slate-800 sm:text-xl">
          <div className="whitespace-nowrap text-right ">
            {nameFields('Загальна оцінка:')}
            {product.type === 'BOOK' && (
              <>
                {nameFields('Оцінка історії:')}
                {nameFields('Оцінка написання:')}
                {nameFields('Оцінка інформативності:')}
              </>
            )}
            {product.type === 'GAME' && (
              <>
                {nameFields('Оцінка графіки:')}
                {nameFields('Оцінка сюжету:')}
                {nameFields('Оцінка геймплею:')}
                {nameFields('Оцінка звуку:')}
                {nameFields('Кількість годин у грі:')}
              </>
            )}
            {product.type === 'FILM' && (
              <>
                {nameFields('Візуальна оцінки:')}
                {nameFields('Оцінка сюжету:')}
                {nameFields('Оцінка звуку:')}
                {nameFields('Оцінка акторської гри:')}
              </>
            )}
          </div>
          <div className="text-right font-extrabold">
            {fieldCommonEstimates(product.commonRating)}
            {product.type === 'BOOK' && (
              <>
                {fieldCommonEstimates(product.commonStoryMark!)}
                {fieldCommonEstimates(product.commonArtMark!)}
                {fieldCommonEstimates(product.commonInfoMark!)}
              </>
            )}
            {product.type === 'GAME' && (
              <>
                {fieldCommonEstimates(product.commonVisualMark!)}
                {fieldCommonEstimates(product.commonStoryMark!)}
                {fieldCommonEstimates(product.commonGameplayMark!)}
                {fieldCommonEstimates(product.commonSoundMark!)}
                <h1 className={` pb-4 pl-2`}>
                  <span className=" border-b-2 border-zinc-700">
                    {product.spentTime!}
                  </span>
                </h1>
              </>
            )}
            {product.type === 'FILM' && (
              <>
                {fieldCommonEstimates(product.commonVisualMark!)}
                {fieldCommonEstimates(product.commonStoryMark!)}
                {fieldCommonEstimates(product.commonSoundMark!)}
                {fieldCommonEstimates(product.commonActMark!)}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="min-w-[3%] rounded border-r-4 border-slate-700"></div>
      <div className="min-w-[2%] "></div>

      <div className="w-[40%] ">
        <h1 className="truncate pb-3 text-center text-xs md:text-xl">
          <span className=" font-bold text-green-800 ">
            Оцінки користувача {profile}
          </span>
        </h1>
        <div className="text-center text-xs font-extrabold md:text-xl">
          {fieldCommonEstimates(product.rating)}
          {product.type === 'BOOK' && (
            <>
              {fieldCommonEstimates(product.storyMark!)}
              {fieldCommonEstimates(product.artMark!)}
              {fieldCommonEstimates(product.infoMark!)}
            </>
          )}
          {product.type === 'GAME' && (
            <>
              {fieldCommonEstimates(product.visualMark!)}
              {fieldCommonEstimates(product.storyMark!)}
              {fieldCommonEstimates(product.gameplayMark!)}
              {fieldCommonEstimates(product.soundMark!)}
              <h1 className={` pb-2`}>
                <span>{product.spentTime!}</span>
              </h1>
            </>
          )}
          {product.type === 'FILM' && (
            <>
              {fieldCommonEstimates(product.visualMark!)}
              {fieldCommonEstimates(product.storyMark!)}
              {fieldCommonEstimates(product.soundMark!)}
              {fieldCommonEstimates(product.actMark!)}
            </>
          )}
        </div>
      </div>
    </div>
  );

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
          reviewId: product.reviewId,
        });
        setIsOpenReport(false);
      }}
    >
      Відправити скаргу
    </Button>
  );

  const reviewText = (
    <div className="relative overflow-hidden break-words">
      {openReport && (
        <SureMessage
          actionBar={actionBar}
          onClose={setIsOpenReport}
          isReport
          message={reportMessage}
          setMessage={setReportMessage}
        ></SureMessage>
      )}
      {user && !report && (
        <div className=" absolute top-0 right-0">
          <span
            title="Поскаржитись"
            className="cursor-pointer  text-2xl text-red-900"
            onClick={() => setIsOpenReport(true)}
          >
            <MdReport />
          </span>
        </div>
      )}
      <h1 className=" text-center text-xl font-bold text-slate-800">
        Відгук користувача {profile}
      </h1>
      <h1 className="whitespace-pre-wrap pt-4">{product.reviewBody}</h1>
      {report && (
        <div className="mt-5">
          <h1 className="border-t-4 border-slate-600 text-sm italic sm:text-base">
            {report.reportBody}
          </h1>
        </div>
      )}
      <div className="flex justify-center pt-5 ">
        <div className={`flex pr-2 md:pr-5 ${!user && 'opacity-50'}`}>
          <h1 className="cursor-default select-none text-sm md:text-xl">
            {likeQuantity}
          </h1>
          <AiFillLike
            className={` ${newLike ? 'text-green-700' : 'text-slate-800'} ${
              user ? 'cursor-pointer' : 'cursor-default'
            }  text-base md:text-2xl`}
            onClick={() => {
              if (user) {
                addReaction({
                  user,
                  isLike: 1,
                  reviewId: product.reviewId,
                  productId: product.id,
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
        <div className={`flex ${!user && 'opacity-50'} `}>
          <h1 className="cursor-default select-none text-sm md:text-xl">
            {dislikeQuantity}
          </h1>
          <AiFillDislike
            className={`${newDislike ? 'text-red-700' : 'text-slate-800'} ${
              user ? 'cursor-pointer' : 'cursor-default'
            } text-base md:text-2xl`}
            onClick={() => {
              if (user) {
                addReaction({
                  user,
                  isLike: 0,
                  reviewId: product.reviewId,
                  productId: product.id,
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
      </div>
      <div className="absolute right-0 bottom-0 text-right text-[10px] text-slate-500 md:text-sm">
        <h1>
          Додано: {moment(product.reviewTime).format('HH:mm | DD-MMM-YYYY ')}
        </h1>
        {product.reviewIsEdit && (
          <h1 className="text-left">
            Відредаговано:{' '}
            {moment(product.reviewEditTime).format('HH:mm | DD-MMM-YYYY ')}
          </h1>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex w-full">
      <div className="w-[6%]"></div>
      <div className="w-[88%]">
        <div className="flex h-fit w-full rounded bg-slate-400 pt-5 pb-5 shadow shadow-black/50">
          <div className="w-[2%]"></div>
          <div className="w-[96%]">{marks}</div>
          <div className="w-[2%]"></div>
        </div>
        {product.reviewBody.length > 0 ? (
          <div
            className={`${
              report ? 'bg-yellow-300 opacity-70' : 'bg-slate-400 '
            } mt-10 flex h-fit w-full rounded pt-5 pb-5 shadow shadow-black/50`}
          >
            <div className="w-[2%]"></div>
            <div className="w-[96%]">{reviewText}</div>
            <div className="w-[2%]"></div>
          </div>
        ) : (
          <div className="flex w-full justify-center pt-48">
            <h1 className=" select-none text-6xl font-bold text-slate-800/50">
              НЕ МАЄ ВІДГУКУ
            </h1>
          </div>
        )}
      </div>
      <div className="w-[6%]"></div>
    </div>
  );
};

export { ProfileProductUserInfo };
