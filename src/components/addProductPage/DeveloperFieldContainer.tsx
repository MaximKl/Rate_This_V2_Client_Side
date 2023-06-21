import { useEffect, useState } from 'react';
import { DeveloperToAdd } from '../../interfaces/product/addProduct/DeveloperToAdd';
import moment from 'moment';
import { Button } from '../ui/Button';
import { DeveloperForUpdate } from '../../interfaces/product/addProduct/DeveloperForUpdate';

interface DeveloperFieldContainerProps {
  setReadiness: React.Dispatch<React.SetStateAction<boolean>>;
  readiness: boolean;
  setData: React.Dispatch<React.SetStateAction<DeveloperToAdd | undefined>>;
  updateInfo?: DeveloperForUpdate;
}

const DeveloperFieldContainer: React.FC<DeveloperFieldContainerProps> = ({
  setReadiness,
  readiness,
  setData,
  updateInfo,
}) => {
  const [devName, setDevName] = useState('');
  const [devPhoto, setDevPhoto] = useState<File | undefined | Blob>(undefined);
  const [devPhotoString, setDevPhotoString] = useState('');
  const [devBirthday, setDevBirthday] = useState(new Date());
  const [devDescription, setDevDescription] = useState('');

  useEffect(() => {
    if (updateInfo) {
      setDevName(updateInfo.name);
      setDevDescription(updateInfo.description);
      setDevBirthday(new Date(updateInfo.birthday));
      updateInfo.photo.startsWith('link:')
        ? setDevPhotoString(updateInfo.photo.substring(5))
        : fetch(`data:image/png;base64,${updateInfo.photo}`)
            .then((d) => d.blob())
            .then((b) => setDevPhoto(b));
    }
  }, []);

  useEffect(() => {
    devPhoto && setDevPhotoString('');
  }, [devPhoto]);

  useEffect(() => {
    devPhotoString.length > 0 && setDevPhoto(undefined);
  }, [devPhotoString]);

  let file: HTMLInputElement | null = null;

  var nameError = !(devName.length < 5000 && devName.length > 2);
  var descriptionError = !(
    devDescription.length < 5000 && devDescription.length > 20
  );

  var pictureSizeError =
    devPhoto === undefined ? false : devPhoto.size > 3_145_728;

  var pictureStringError = devPhotoString.length > 1800;
  var birthdayError = !(devBirthday < new Date());

  useEffect(() => {
    const isReady =
      !nameError &&
      !descriptionError &&
      !pictureStringError &&
      !birthdayError &&
      !pictureSizeError &&
      (devPhoto !== undefined || devPhotoString.length > 0);

    if (isReady) {
      if (devPhoto) {
        const reader = new FileReader();
        reader.readAsDataURL(devPhoto);
        reader.onload = function () {
          var prictureForSend = reader.result as string;
          setData({
            id: 0,
            name: devName,
            birthday: devBirthday,
            description: devDescription,
            photo: prictureForSend,
            country: 0,
            roles: [],
          });
          setReadiness(isReady);
        };
        return;
      } else {
        setData({
          id: 0,
          name: devName,
          birthday: devBirthday,
          description: devDescription,
          country: 0,
          roles: [],
          photo: 'link:' + devPhotoString,
        });
      }
    }
    setReadiness(isReady);
  }, [devName, devBirthday, devDescription, devPhoto, devPhotoString]);

  return (
    <div
      className={`${
        readiness
          ? 'border-green-800 shadow-green-800/90'
          : 'border-red-800 shadow-red-800/60'
      } addProductScrollbar h-fit max-h-[800px] w-fit max-w-[26rem] overflow-y-auto 
      rounded-lg border-4 bg-slate-400 px-2 py-4 shadow-2xl`}
    >
      <div className="mx-auto w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">
          Назва компанії / ім'я творця
        </h1>
        <input
          type="text"
          placeholder="назва компанії / ім'я творця"
          value={devName}
          onChange={(e) => setDevName(e.target.value)}
          className=" w-96 rounded pl-1 font-bold"
        />
        <h1
          className={`${
            nameError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {devName.length}/500
        </h1>
      </div>

      <div className="mx-auto mt-2 w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">
          Дата заснування / народження
        </h1>
        <input
          type="date"
          value={moment(devBirthday).format('YYYY-MM-DD')}
          onChange={(e) => setDevBirthday(new Date(e.target.value))}
          className="w-96 rounded pl-1 text-center font-bold"
        />
        <h1
          className={`${
            birthdayError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {birthdayError ? '*не може бути у майбутньому' : ''}
        </h1>
      </div>

      <div className="mx-auto mt-4 w-fit text-slate-800 ">
        <h1 className="pb-1 text-center text-lg font-bold">Опис</h1>
        <textarea
          value={devDescription}
          placeholder="опис творця"
          onChange={(e) => {
            setDevDescription(e.target.value);
          }}
          className="min-h-[70px] w-96 rounded pl-1 text-black"
        />
        <h1
          className={`${
            descriptionError ? 'text-red-700' : 'text-slate-800'
          } text-right text-sm font-medium`}
        >
          {descriptionError && '*мінімум 20 символів '}
          {devDescription.length}/5000
        </h1>
      </div>

      <div className="mx-auto mt-4 w-fit text-slate-800">
        <h1 className="pb-1 text-center text-lg font-bold">Зображення</h1>
        <div className="mb-2 flex flex-col">
          <h1 className="pb-1 font-medium ">
            Текстове посилання на зображення
          </h1>
          <input
            type="text"
            value={devPhotoString}
            placeholder="приклад: http://link"
            onChange={(e) => {
              setDevPhotoString(e.target.value);
            }}
            className="w-96 rounded pl-1 text-center font-bold"
          />
          <h1
            className={`${
              pictureStringError ? 'text-red-700' : 'text-slate-800'
            } text-right text-sm font-medium`}
          >
            {devPhotoString.length}/3800
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
              setDevPhoto(e.target.files![0]);
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
      {(devPhoto || devPhotoString.length > 0) && (
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
            {devPhoto && (
              <img
                src={URL.createObjectURL(devPhoto)}
                className="shadow-lg shadow-slate-800/80"
                alt="developer_picture"
              />
            )}
            {devPhotoString.length > 0 && (
              <img
                src={devPhotoString}
                className="shadow-lg shadow-slate-800/80"
                alt="developer_picture"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export { DeveloperFieldContainer };
