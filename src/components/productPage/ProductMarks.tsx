import { useEstimateColor } from '../../hooks/use-estimate-color';
import { useNavigation } from '../../hooks/use-navigation';
import { UserPrivateProductEstimates } from '../../interfaces/product/UserPrivateProductEstimates';
import { Product } from '../../interfaces/product/Product';
import {
  useGetExistingMarksQuery,
  useRemoveEstimatesMutation,
  useSendEstimatesMutation,
} from '../../store/apis/productApis';
import { SureMessage } from '../SureMessage';
import { Button } from '../ui/Button';
import { useState, useEffect } from 'react';

interface ProductMarksProps {
  product: Product;
  authorization: boolean;
}

const ProductMarks: React.FC<ProductMarksProps> = ({
  product,
  authorization,
}) => {
  const { user, unauthorizeUser, service } = useNavigation();
  const [commonPrivateEstimate, setCommonPrivateEstimate] = useState<
    number | undefined
  >();
  const [firstEstimete, setFirstEstimete] = useState<number | undefined>();
  const [secondEstimete, setSecondEstimete] = useState<number | undefined>();
  const [thirdEstimete, setThirdEstimete] = useState<number | undefined>();
  const [fourthEstimete, setFourthEstimete] = useState<number | undefined>();
  const [fifthEstimete, setFifthEstimete] = useState<number | undefined>();
  const [openDeleteAccept, setOpenDeleteAccept] = useState(false);
  const [changeEstimates, setChangeEstimates] = useState(false);

  const { data, isError } = useGetExistingMarksQuery({
    user,
    productId: product.id,
    service,
  });
  const [estimates, setEstimates] = useState<
    UserPrivateProductEstimates | undefined
  >();
  const [sendEstimate, sendBookResponse] = useSendEstimatesMutation();
  const [removeEstimate, removeBookResponse] = useRemoveEstimatesMutation();

  const { chooseColor } = useEstimateColor();

  useEffect(() => {
    isError ? setEstimates(undefined) : setEstimates(data);
  }, [data, isError]);

  useEffect(() => {
    if (estimates) {
      setCommonPrivateEstimate(estimates.rating);
      if (product.type === 'BOOK') {
        setFirstEstimete(estimates.storyMark);
        setSecondEstimete(estimates.artMark);
        setThirdEstimete(estimates.infoMark);
      }
      if (product.type === 'GAME') {
        setFirstEstimete(estimates.visualMark);
        setSecondEstimete(estimates.storyMark);
        setThirdEstimete(estimates.gameplayMark);
        setFourthEstimete(estimates.soundMark);
        setFifthEstimete(estimates.spentTime);
      }
      if (product.type === 'FILM') {
        setFirstEstimete(estimates.visualMark);
        setSecondEstimete(estimates.storyMark);
        setThirdEstimete(estimates.soundMark);
        setFourthEstimete(estimates.actMark);
      }
    } else {
      commonPrivateEstimate !== undefined &&
        setCommonPrivateEstimate(undefined);
      firstEstimete !== undefined && setFirstEstimete(undefined);
      secondEstimete !== undefined && setSecondEstimete(undefined);
      thirdEstimete !== undefined && setThirdEstimete(undefined);
      fourthEstimete !== undefined && setFourthEstimete(undefined);
      fifthEstimete !== undefined && setFifthEstimete(undefined);
    }
  }, [estimates]);

  useEffect(() => {
    if (sendBookResponse.isError || removeBookResponse.isError) {
      unauthorizeUser();
    }
  }, [sendBookResponse, removeBookResponse]);

  const sendEstimates = () => {
    if (commonPrivateEstimate! < 0) return;

    if (
      product.type === 'BOOK' &&
      firstEstimete! > 0 &&
      secondEstimete! > 0 &&
      thirdEstimete! > 0
    ) {
      sendEstimate({
        estimates: {
          profileId: user!.id,
          productId: product.id,
          storyMark: firstEstimete!,
          artMark: secondEstimete!,
          infoMark: thirdEstimete!,
          rating: commonPrivateEstimate!,
        },
        token: user!.token,
        service,
      });
    }

    if (
      product.type === 'FILM' &&
      firstEstimete! > 0 &&
      secondEstimete! > 0 &&
      thirdEstimete! > 0 &&
      fourthEstimete! > 0
    ) {
      sendEstimate({
        estimates: {
          profileId: user!.id,
          productId: product.id,
          visualMark: firstEstimete!,
          storyMark: secondEstimete!,
          soundMark: thirdEstimete!,
          actMark: fourthEstimete!,
          rating: commonPrivateEstimate!,
        },
        token: user!.token,
        service,
      });
    }
    if (
      product.type === 'GAME' &&
      firstEstimete! > 0 &&
      secondEstimete! > 0 &&
      thirdEstimete! > 0 &&
      fourthEstimete! > 0 &&
      fifthEstimete! > 0
    ) {
      sendEstimate({
        estimates: {
          profileId: user!.id,
          productId: product.id,
          visualMark: firstEstimete!,
          storyMark: secondEstimete!,
          gameplayMark: thirdEstimete!,
          soundMark: fourthEstimete!,
          spentTime: fifthEstimete,
          rating: commonPrivateEstimate!,
        },
        token: user!.token,
        service,
      });
    }
  };

  const checkPosibilityToSend = (): boolean => {
    if (
      !commonPrivateEstimate ||
      !firstEstimete ||
      !secondEstimete ||
      !thirdEstimete
    )
      return false;

    if (product.type === 'BOOK') {
      return (
        commonPrivateEstimate > 0 &&
        firstEstimete > 0 &&
        secondEstimete > 0 &&
        thirdEstimete > 0
      );
    }

    if (product.type === 'FILM') {
      if (!fourthEstimete) return false;

      return (
        commonPrivateEstimate > 0 &&
        firstEstimete > 0 &&
        secondEstimete > 0 &&
        thirdEstimete > 0 &&
        fourthEstimete > 0
      );
    }

    if (product.type === 'GAME') {
      if (!fourthEstimete || !fifthEstimete) return false;
      return (
        commonPrivateEstimate > 0 &&
        firstEstimete > 0 &&
        secondEstimete > 0 &&
        thirdEstimete > 0 &&
        fourthEstimete > 0 &&
        fifthEstimete > 0
      );
    }
    return false;
  };

  const nameFields = (fieldName: string) => {
    return (
      <h1 className=" pb-2">
        <span className="border-b-2 border-zinc-700">{fieldName}</span>
      </h1>
    );
  };

  const fieldCommonEstimates = (estimate: number) => {
    return (
      <h1 className={`${chooseColor(estimate)} pb-2`}>
        <span>{estimate}</span>
      </h1>
    );
  };

  const estimateButton = (
    <Button
      success={checkPosibilityToSend()}
      secondary={!checkPosibilityToSend()}
      rounded
      disabled={!checkPosibilityToSend()}
      className={`${
        checkPosibilityToSend()
          ? 'cursor-pointer duration-200 hover:brightness-110'
          : 'cursor-not-allowed'
      } shadow shadow-black/20`}
      onClick={() => {
        if (!checkPosibilityToSend()) {
          return;
        }
        sendEstimates();
        setChangeEstimates(false);
      }}
    >
      ОЦІНИТИ!
    </Button>
  );

  const standartInput = (
    setter: React.Dispatch<React.SetStateAction<number | undefined>>,
    currentValue: number | undefined
  ) => {
    return (
      <div className="w-fill pb-2">
        <input
          type="text"
          placeholder="1-100"
          className="h-4 max-w-[85px] text-center outline-4 outline-green-600 sm:h-6"
          onChange={(e) => {
            if (e.target.value !== '') {
              if (
                Number.parseInt(e.target.value) <= 100 &&
                e.target.value.length <= 3
              ) {
                setter(Number.parseInt(e.target.value));
                return;
              }
              if (e.target.value.length === 3 || e.target.value.length === 4) {
                setter(currentValue);
                return;
              }
            }
            setter(undefined);
          }}
          value={currentValue === undefined ? '' : currentValue}
        ></input>
      </div>
    );
  };

  const marks = (
    <>
      <div className="flex pb-2">
        <div className={`${authorization ? 'w-[65%]' : 'w-full'}  mr-3`}>
          <h1 className="truncate pb-2">
            <span className="text-[9px] font-bold text-slate-800  sm:text-xs md:text-xl">
              Середні оцінки усіх користувачів
            </span>
          </h1>
        </div>
        {authorization && (
          <div className="justify-left w-[35%] ">
            <h1 className="truncate pb-2 text-left">
              <span className="text-xs font-bold text-green-800 md:text-xl">
                Ваші оіцінки
              </span>
            </h1>
          </div>
        )}
      </div>
      <div className="flex w-full justify-center text-xs text-slate-800 sm:text-xl">
        <div className="w-fit whitespace-nowrap text-right ">
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
        <div className="w-[6%] min-w-[3%]"></div>
        <div className="min-w-[9%] text-left font-extrabold underline">
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
        {authorization && (
          <>
            <div className="min-w-[3%] rounded border-r-4 border-slate-700"></div>
            <div className="min-w-[4%]"></div>
            <div className="flex flex-col">
              {estimates && !changeEstimates ? (
                <div className="text-right font-extrabold underline">
                  {fieldCommonEstimates(estimates.rating)}
                  {product.type === 'BOOK' && (
                    <>
                      {fieldCommonEstimates(estimates.storyMark!)}
                      {fieldCommonEstimates(estimates.artMark!)}
                      {fieldCommonEstimates(estimates.infoMark!)}
                    </>
                  )}
                  {product.type === 'GAME' && (
                    <>
                      {fieldCommonEstimates(estimates.visualMark!)}
                      {fieldCommonEstimates(estimates.storyMark!)}
                      {fieldCommonEstimates(estimates.gameplayMark!)}
                      {fieldCommonEstimates(estimates.soundMark!)}
                      <h1 className={` pb-2`}>
                        <span>{estimates.spentTime!}</span>
                      </h1>
                    </>
                  )}
                  {product.type === 'FILM' && (
                    <>
                      {fieldCommonEstimates(estimates.visualMark!)}
                      {fieldCommonEstimates(estimates.storyMark!)}
                      {fieldCommonEstimates(estimates.soundMark!)}
                      {fieldCommonEstimates(estimates.actMark!)}
                    </>
                  )}
                </div>
              ) : (
                <>
                  {standartInput(
                    setCommonPrivateEstimate,
                    commonPrivateEstimate
                  )}
                  {product.type === 'BOOK' && (
                    <>
                      {standartInput(setFirstEstimete, firstEstimete)}
                      {standartInput(setSecondEstimete, secondEstimete)}
                      {standartInput(setThirdEstimete, thirdEstimete)}
                    </>
                  )}
                  {product.type === 'FILM' && (
                    <>
                      {standartInput(setFirstEstimete, firstEstimete)}
                      {standartInput(setSecondEstimete, secondEstimete)}
                      {standartInput(setThirdEstimete, thirdEstimete)}
                      {standartInput(setFourthEstimete, fourthEstimete)}
                    </>
                  )}
                  {product.type === 'GAME' && (
                    <>
                      {standartInput(setFirstEstimete, firstEstimete)}
                      {standartInput(setSecondEstimete, secondEstimete)}
                      {standartInput(setThirdEstimete, thirdEstimete)}
                      {standartInput(setFourthEstimete, fourthEstimete)}
                      <div className="w-fill pb-2">
                        <input
                          type="text"
                          placeholder="1-10000"
                          className="h-4 max-w-[85px] text-center outline-4 outline-green-600 sm:h-6"
                          onChange={(e) => {
                            if (e.target.value !== '') {
                              if (
                                Number.parseInt(e.target.value) <= 10000 &&
                                e.target.value.length <= 5
                              ) {
                                setFifthEstimete(
                                  Number.parseInt(e.target.value)
                                );
                                return;
                              }
                              if (
                                e.target.value.length === 5 ||
                                e.target.value.length === 6
                              ) {
                                setFifthEstimete(fifthEstimete);
                                return;
                              }
                            }
                            setFifthEstimete(undefined);
                          }}
                          value={
                            fifthEstimete === undefined ? '' : fifthEstimete
                          }
                        ></input>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="w-[6%] min-w-[3%]"></div>
          </>
        )}
      </div>

      <div className="flex justify-center pt-5">
        {authorization ? (
          <>
            {estimates && !changeEstimates ? (
              <Button
                success
                rounded
                className={`cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110`}
                onClick={() => {
                  setChangeEstimates(true);
                }}
              >
                ЗМІНИТИ ОЦІНКИ
              </Button>
            ) : (
              <>
                {estimates && changeEstimates && (
                  <div className="flex w-full justify-evenly">
                    <div>
                      <h1
                        onClick={() => {
                          setChangeEstimates(false);
                        }}
                        className="mt-2 cursor-pointer text-lg font-semibold text-fuchsia-900 underline"
                      >
                        Відмінити
                      </h1>
                    </div>
                    <div className="min-w-fit">{estimateButton}</div>
                    <div className="min-w-fit">
                      <Button
                        danger
                        rounded
                        className={` cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110`}
                        onClick={() => {
                          setOpenDeleteAccept(true);
                        }}
                      >
                        ВИДАЛИТИ
                      </Button>
                    </div>
                  </div>
                )}
                {!estimates && estimateButton}
              </>
            )}
          </>
        ) : (
          <h1 className="text-lg font-bold text-slate-800">
            Для оцінення продукту ви повинні авторизуватися
          </h1>
        )}
      </div>
    </>
  );

  const actionBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        removeEstimate({
          user,
          productId: product.id,
          service,
        });
        setChangeEstimates(false);
        setOpenDeleteAccept(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  return (
    <div className="flex h-fit w-full rounded bg-slate-400 pt-5 pb-5 text-center shadow shadow-black/50">
      {openDeleteAccept && (
        <SureMessage
          actionBar={actionBar}
          onClose={setOpenDeleteAccept}
          elementName="видалити свої оцінки?"
        />
      )}
      <div className="w-[3%]"></div>
      <div className="w-[94%]">{marks}</div>
      <div className="w-[3%]"></div>
    </div>
  );
};

export { ProductMarks };
