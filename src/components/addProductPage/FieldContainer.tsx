import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { MainProductInfo } from '../../interfaces/product/addProduct/MainProductInfo';

interface FieldContainerProps {
  setProductType: React.Dispatch<React.SetStateAction<string>>;
  productType: string;
  setReadiness: React.Dispatch<React.SetStateAction<boolean>>;
  readiness: boolean;
  setData: React.Dispatch<React.SetStateAction<MainProductInfo | undefined>>;
  data?: MainProductInfo;
}

const FieldContainer: React.FC<FieldContainerProps> = ({
  setProductType,
  setReadiness,
  readiness,
  productType,
  setData,
  data,
}) => {
  const [productName, setProductName] = useState('');
  const [productRelease, setProductRelease] = useState(new Date());
  const [ageRestriction, setAgeRestriction] = useState('0+');
  const [description, setDescription] = useState<string>('');
  const [picture, setPicture] = useState<File | undefined | Blob>(undefined);
  const [pictureString, setPictureString] = useState<string>('');
  const [bookAndFilmSize, setBookAndFilmSize] = useState<string>('');

  useEffect(() => {
    if (data) {
      setProductName(data.name);
      setProductRelease(new Date(data.releaseDate));
      setAgeRestriction(data.ageRestriction);
      setDescription(data.description);
      data.picture.startsWith('link:')
        ? setPictureString(data.picture.substring(5))
        : fetch(`data:image/png;base64,${data.picture}`)
            .then((d) => d.blob())
            .then((b) => setPicture(b));
      setBookAndFilmSize(data.size);
    }
  }, []);

  useEffect(() => {
    picture && setPictureString('');
  }, [picture]);

  useEffect(() => {
    pictureString.length > 0 && setPicture(undefined);
  }, [pictureString]);

  let file: HTMLInputElement | null = null;

  var nameError = !(productName.length < 2000 && productName.length > 0);
  var ageRestrictionError = !(
    (ageRestriction.length === 3 || ageRestriction.length === 2) &&
    ageRestriction[ageRestriction.length - 1] === '+'
  );
  var descriptionError = !(
    description.length < 5000 && description.length > 59
  );
  var pictureSizeError =
    picture === undefined ? false : picture.size > 3_145_728;
  var pictureStringError = !(pictureString.length < 3800);
  var releaseDateError = !(productRelease < new Date());
  var bookAndFilmSizeError =
    productType === 'book' || productType === 'film'
      ? bookAndFilmSize.length > 0
        ? !Number.parseInt(bookAndFilmSize)
        : true
      : false;

  useEffect(() => {
    const isReady =
      !nameError &&
      !ageRestrictionError &&
      !descriptionError &&
      !pictureStringError &&
      !releaseDateError &&
      !bookAndFilmSizeError &&
      productType !== '' &&
      !pictureSizeError &&
      (picture !== undefined || pictureString.length > 0);

    if (isReady) {
      if (picture) {
        const reader = new FileReader();
        reader.readAsDataURL(picture);
        reader.onload = function () {
          var prictureForSend = reader.result as string;
          setData({
            name: productName,
            ageRestriction,
            releaseDate: productRelease,
            type: productType,
            description,
            size: bookAndFilmSize,
            picture: prictureForSend,
          });
        };
      } else {
        setData({
          name: productName,
          ageRestriction,
          releaseDate: productRelease,
          type: productType,
          description,
          size: bookAndFilmSize,
          picture: 'link:' + pictureString,
        });
      }
    }
    setReadiness(isReady);
  }, [
    productName,
    productRelease,
    ageRestriction,
    description,
    picture,
    pictureString,
    productType,
    bookAndFilmSize,
  ]);

  return (
    <div
      className={`${
        readiness
          ? 'border-green-800 shadow-green-800/90'
          : 'border-red-800 shadow-red-800/60'
      } addProductScrollbar h-fit max-h-[800px] w-fit max-w-[26rem] overflow-y-auto rounded-lg border-4 bg-slate-400 px-2 py-4 shadow-2xl`}
    >
      <div className="mx-auto w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">Назва продукту</h1>
        <input
          type="text"
          placeholder="назва продукту"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className=" w-96 rounded pl-1 font-bold"
        />
        <h1
          className={`${
            nameError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {productName.length}/2000
        </h1>
      </div>

      <div className="mx-auto mt-2 w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">Дата релізу</h1>
        <input
          type="date"
          value={moment(productRelease).format('YYYY-MM-DD')}
          onChange={(e) => setProductRelease(new Date(e.target.value))}
          className="w-96 rounded pl-1 text-center font-bold"
        />
        <h1
          className={`${
            releaseDateError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {releaseDateError ? '*не може бути у майбутньому' : ''}
        </h1>
      </div>

      <div className="mx-auto mt-4 font-medium  text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">Тип продукту</h1>
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col items-center">
            <h1>Фільм</h1>
            <input
              type="radio"
              name="product"
              value="film"
              onChange={(e) => setProductType(e.target.value)}
              className=" h-6 w-6 cursor-pointer appearance-none rounded-full border-2
               border-slate-800 bg-slate-300 transition-all duration-200 checked:border-[12px]"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1>Книга</h1>
            <input
              type="radio"
              name="product"
              value="book"
              onChange={(e) => setProductType(e.target.value)}
              className=" h-6 w-6 cursor-pointer appearance-none rounded-full border-2
               border-slate-800 bg-slate-300 transition-all duration-200 checked:border-[12px]"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1>Відеогра</h1>
            <input
              type="radio"
              name="product"
              value="game"
              onChange={(e) => setProductType(e.target.value)}
              className=" h-6 w-6 cursor-pointer appearance-none rounded-full border-2
               border-slate-800 bg-slate-300 transition-all duration-200 checked:border-[12px]"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-4 w-fit text-slate-800 ">
        <h1 className="pb-1 text-center text-lg font-bold">Обмеження віку</h1>
        <input
          type="text"
          value={ageRestriction}
          placeholder="приклад: 16+"
          onChange={(e) => {
            setAgeRestriction(e.target.value);
          }}
          className="w-96 rounded pl-1 text-center font-bold"
        />
        <h1
          className={`${
            ageRestrictionError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {ageRestriction.length}/3
        </h1>
      </div>
      {(productType === 'book' || productType === 'film') && (
        <div className="mx-auto mt-4 w-fit text-slate-800 ">
          <h1 className="pb-1 text-center text-lg font-bold">
            {productType === 'book'
              ? 'Кількість сторінок'
              : 'Тривалість у хвилинах'}
          </h1>
          <input
            type="text"
            value={bookAndFilmSize}
            placeholder={'приклад: 120'}
            onChange={(e) => {
              setBookAndFilmSize(e.target.value);
            }}
            className="w-96 rounded pl-1 text-center font-bold"
          />
          <h1
            className={`${
              bookAndFilmSizeError ? 'text-red-700' : 'text-slate-800'
            } text-right text-sm font-medium`}
          >
            {bookAndFilmSizeError ? '*невірно надані дані' : ''}
          </h1>
        </div>
      )}
      <div className="mx-auto mt-4 w-fit text-slate-800 ">
        <h1 className="pb-1 text-center text-lg font-bold">Опис</h1>
        <textarea
          value={description}
          placeholder="опис продукту"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          className="min-h-[70px] w-96 rounded pl-1 text-black"
        />
        <h1
          className={`${
            descriptionError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {descriptionError && '*мінімум 60 символів '}
          {description.length}/5000
        </h1>
      </div>

      <div className="mx-auto mt-4 w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">
          Зображення продукту
        </h1>
        <div className="mb-2 flex flex-col">
          <h1 className="pb-1 font-medium ">
            Текстове посилання на зображення
          </h1>
          <input
            type="text"
            value={pictureString}
            placeholder="приклад: http://link"
            onChange={(e) => {
              setPictureString(e.target.value);
            }}
            className="w-96 rounded pl-1 text-center font-bold"
          />
          <h1
            className={`${
              pictureStringError ? 'text-red-700' : 'text-slate-800'
            } text-right text-sm font-medium`}
          >
            {pictureString.length}/3800
          </h1>
        </div>
        <h1 className="pb-1 text-center text-lg font-bold">АБО</h1>
        <div className="flex flex-col">
          <h1 className="pb-1 text-center font-medium">
            Зображення на вашому комп'ютері
          </h1>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={(e) => {
              setPicture(e.target.files![0]);
            }}
            className=" hidden"
            ref={(fInput) => {
              file = fInput;
            }}
          ></input>
          <Button
            onClick={() => {
              file!.click();
            }}
            className="mx-auto font-medium shadow shadow-black/50 duration-150 hover:brightness-[1.05]"
            success
          >
            Обрати зображення
          </Button>
        </div>
      </div>
      {(picture || pictureString.length > 0) && (
        <div className="mt-5 flex">
          <div className="my-auto w-[29%] text-center">
            <span
              className={`${
                pictureSizeError ? 'text-red-700' : 'text-slate-800'
              } pr-2 font-bold`}
            >
              Надане зображення {pictureSizeError ? '(не більше 3мб)' : ''}
            </span>
          </div>
          <div className="w-full">
            {picture && (
              <img
                src={URL.createObjectURL(picture)}
                className="shadow-lg shadow-slate-800/80"
                alt="product_picture"
              />
            )}
            {pictureString.length > 0 && (
              <img
                src={pictureString}
                className="shadow-lg shadow-slate-800/80"
                alt="product_picture"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { FieldContainer };
