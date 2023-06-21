import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { RxCrossCircled } from 'react-icons/rx';
import { useState, useEffect } from 'react';
import {
  useDeleteProfileMutation,
  useGetSettingsInfoQuery,
  useSettingsMutation,
} from '../store/apis/authorizationApis';
import { useNavigation } from '../hooks/use-navigation';
import moment from 'moment';
import { SureMessage } from './SureMessage';

interface SettingsProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Settings: React.FC<SettingsProps> = ({
  setIsSettingsOpen,
  isSettingsOpen,
}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(true);

  const [nick, setNick] = useState('');
  const [nickError, setNickError] = useState<string[]>([]);

  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string[]>([]);

  const [repeatPassword, setRepeatPassword] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState(true);

  const [birthday, setBirth] = useState<Date>(new Date());
  const [birthError, setBirthError] = useState<string[]>([]);

  const [avatar, setAvatar] = useState<File>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarError, setAvatarError] = useState(false);

  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState(false);

  const [updateStatus, setUpdateStatus] = useState(0);

  const { user, setUser, unauthorizeUser } = useNavigation();
  const [updateUser, updateResponse] = useSettingsMutation();
  const { data, isError, refetch } = useGetSettingsInfoQuery(
    user ? user.token : ''
  );
  const [deleteProfile, deleteProfileResponse] = useDeleteProfileMutation();
  const [deleteAssurance, setDeleteAssurance] = useState(false);

  const testEmail = (mail: string) => {
    const expression: RegExp =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return expression.test(mail);
  };

  useEffect(() => {
    if (updateResponse.isSuccess) {
      setIsSettingsOpen(false);
      setUser({ ...updateResponse.data, token: user?.token! });
    }
    if (updateResponse.error) {
      if ('status' in updateResponse.error!) {
        if (updateResponse.error.data === 'nick_exist') {
          setUpdateStatus(409);
          return;
        }
        if (updateResponse.error.data === 'mail_exist') {
          setUpdateStatus(410);
          return;
        }
        setUpdateStatus(updateResponse.error.status as number);
      }
    }
  }, [updateResponse]);

  useEffect(() => {
    deleteProfileResponse.isError && unauthorizeUser();
    deleteProfileResponse.isSuccess && window.location.replace(`/RateThis`);
  }, [deleteProfileResponse]);

  useEffect(() => {
    if (data) {
      setNick(data.nick);
      setBirth(data.birthday);
      setDescription(data.description);
      fetch(`data:image/png;base64,${data.avatar}`)
        .then((d) => d.blob())
        .then((b) => setAvatarPreview(URL.createObjectURL(b)));
      setEmail(data.email);
    }
  }, [data]);

  useEffect(() => {
    isError && unauthorizeUser();
  }, [isError]);

  useEffect(() => {
    isSettingsOpen && refetch();
  }, [isSettingsOpen]);

  useEffect(() => {
    const errors: string[] = [];
    var minusThreeYears = new Date();
    minusThreeYears.setFullYear(new Date().getFullYear() - 3);
    var yearLimit = new Date();
    yearLimit.setFullYear(new Date().getFullYear() - 100);
    birthday > new Date() &&
      errors.push('• Дата народження не можу бути у майбутньому');
    birthday > minusThreeYears &&
      errors.push('• Вам не можу бути менше трьох років');
    birthday < yearLimit && errors.push('• Вам не можу бути більше 100 років');
    setBirthError(errors);
  }, [birthday]);

  useEffect(() => {
    setEmailError(!testEmail(email));
  }, [email]);

  useEffect(() => {
    const errors: string[] = [];
    const latinExpression: RegExp = /[А-Яа-яєЄїЇіІґҐ]+/;
    const expression: RegExp = /^[A-Z]{1}/;
    const letterExp: RegExp = /[^\w]/;
    const minLenghtExp: RegExp = /\w{3}/;
    latinExpression.test(nick) && errors.push('• Тільки латинські сисмоволи');
    !expression.test(nick) && errors.push('• Перша літера має бути великою');
    letterExp.test(nick) && errors.push('• Тільки літери, цифри та _');
    !minLenghtExp.test(nick) && errors.push('• Мінімум 3 симоволи');
    nick.length > 50 && errors.push('• Максимум 50 символів');
    setNickError(errors);
  }, [nick]);

  useEffect(() => {
    const errors: string[] = [];
    const lenghtExp: RegExp = /\w{6}/;
    const expression: RegExp = /[^\w]/;
    !lenghtExp.test(password) && errors.push('• Мінімум 6 символів');
    expression.test(password) &&
      errors.push('• Тільки латинські літери та цифри');
    setPasswordError(errors);
  }, [password]);

  useEffect(() => {
    setRepeatPasswordError(repeatPassword !== password);
  }, [repeatPassword, password]);

  useEffect(() => {
    avatar && setAvatarError(avatar.size > 2_097_152);
    avatar && setAvatarPreview(URL.createObjectURL(avatar));
  }, [avatar]);

  useEffect(() => {
    setDescriptionError(description.length > 2000);
  }, [description]);

  const birthMessage = birthError.map((e) => {
    return (
      <h1 key={e} className="font-bold text-rose-700">
        {e}
      </h1>
    );
  });

  const emailMessage = (
    <h1 className="font-bold text-rose-700">Не є еклектронною поштою</h1>
  );

  const nickMessage = nickError.map((e) => {
    return (
      <h1 key={e} className="font-bold text-rose-700">
        {e}
      </h1>
    );
  });

  const passwordMessage = passwordError.map((e) => (
    <h1 key={e} className="font-bold text-rose-700">
      {e}
    </h1>
  ));

  const repeatPasswordMessage = (
    <h1
      className={`${
        repeatPasswordError
          ? 'font-bold text-rose-700'
          : 'font-bold text-emerald-700'
      }`}
    >
      {repeatPasswordError ? 'Паролі не співпадають' : 'Паролі співпадають'}
    </h1>
  );

  const avatarMessage = (
    <h1 className="font-bold text-rose-700">Не більше 2 мб</h1>
  );

  const descriptionMessage = (
    <h1 className="font-bold text-rose-700">Не більше 2000 символів</h1>
  );

  const updateMessage = (
    <>
      {updateStatus === 500 && (
        <h1 className="font-bold text-rose-700">
          Сталася помилка при збережені даних. Спробуйте ще раз.
        </h1>
      )}
      {updateStatus === 404 && (
        <h1 className="font-bold text-rose-700">
          Помилка валідації даних при оновлені.
        </h1>
      )}
      {updateStatus === 409 && (
        <h1 className="font-bold text-rose-700">
          Користувача з таким іменем вже зареєстровано.
        </h1>
      )}
      {updateStatus === 410 && (
        <h1 className="font-bold text-rose-700">
          Користувача з такою поштою вже зареєстровано.
        </h1>
      )}
    </>
  );

  const errorOutline = (isError: boolean): string => {
    return isError
      ? 'outline-red-400  border-rose-500'
      : 'outline-sky-400  border-blue-500';
  };

  const checkForErrors = () => {
    return (
      emailError ||
      nickError.length > 0 ||
      birthError.length > 0 ||
      passwordError.length > 0 ||
      repeatPasswordError ||
      avatarError ||
      descriptionError
    );
  };

  const deleteBar = (
    <Button
      rounded
      success
      className="cursor-pointer shadow shadow-black/20 duration-200 hover:brightness-110"
      onClick={() => {
        if (user) {
          deleteProfile({
            profileId: user.id,
            token: user.token,
          });
        }
        setDeleteAssurance(false);
      }}
    >
      Так, я впевнений
    </Button>
  );

  let file: HTMLInputElement | null = null;

  const actionBar = (
    <Button
      className={`${
        checkForErrors()
          ? 'cursor-not-allowed'
          : 'shadow shadow-black/60 duration-150 hover:brightness-[1.20]'
      }`}
      onClick={() => {
        if (checkForErrors()) {
          return;
        }
        var image = 'DEF_IMAGE';
        const userProfile = {
          email,
          birthday,
          description,
          nick,
          password,
          avatar: image,
        };
        if (avatar) {
          const reader = new FileReader();
          reader.readAsDataURL(avatar);
          reader.onload = function () {
            image = reader.result as string;
            updateUser({
              user: { ...userProfile, avatar: image },
              token: user?.token!,
            });
          };
        } else {
          updateUser({ user: userProfile, token: user?.token! });
        }
      }}
      primary={!checkForErrors()}
      secondary={checkForErrors()}
    >
      ОНОВИТИ ІНФОРМАЦІЮ
    </Button>
  );

  const modal = (
    <Modal onRegister={true} onClose={setIsSettingsOpen} actionBar={actionBar}>
      <div className="relative mb-4 flex h-fit justify-center">
        <h1 className=" text-2xl font-bold uppercase text-slate-700 underline">
          Редагування профілю
        </h1>
        <RxCrossCircled
          onClick={() => {
            setIsSettingsOpen(false);
          }}
          className="absolute right-0 cursor-pointer text-3xl font-extrabold text-slate-800 duration-150 hover:text-slate-600"
        />
      </div>

      <div className="flex w-full flex-col  items-center justify-center">
        <div className="mb-3">
          <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
            Нікнейм
          </h1>
          <input
            onChange={(e) => {
              setNick(e.target.value);
            }}
            type="text"
            className={` ${errorOutline(
              nickError.length > 0
            )} h-10 w-[24rem] rounded border-4 pl-2 outline-2 `}
            placeholder="Ваш нікнейм"
            value={nick}
          ></input>
          {nickError.length > 0 && nickMessage}
        </div>

        <div className="mb-3">
          <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
            Електронна пошта
          </h1>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            className={`${errorOutline(
              emailError
            )} h-10 w-[24rem] rounded border-4 pl-2 outline-2`}
            placeholder="Ваша електронна пошта"
            value={email}
          ></input>
          {emailError && emailMessage}
        </div>

        <div className="">
          <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
            Пароль
          </h1>
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className={`${errorOutline(
              passwordError.length > 0
            )} h-10 w-[24rem] rounded border-4 pl-2 outline-2`}
            placeholder="Ваш пароль"
            value={password}
          ></input>
          {passwordError.length > 0 && passwordMessage}
        </div>

        <div className="">
          <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
            Повторіть пароль
          </h1>
          <input
            onChange={(e) => {
              setRepeatPassword(e.target.value);
            }}
            type="password"
            className={`${errorOutline(
              repeatPasswordError
            )} h-10 w-[24rem] rounded border-4 pl-2 outline-2 `}
            placeholder="Повторіть уведений пароль"
            value={repeatPassword}
          ></input>
          {repeatPassword.length > 0 && repeatPasswordMessage}
        </div>

        <div className="mt-3">
          <h1 className="pb-1 text-center text-lg font-bold text-slate-800">
            Дата народження
          </h1>
          <input
            onChange={(e) => {
              setBirth(new Date(e.target.value));
            }}
            type="date"
            className={`outline-2 ${errorOutline(
              birthError.length > 0
            )} h-10 w-[24rem] rounded border-4 pl-2 `}
            placeholder="Ваша дата народження"
            value={moment(birthday).format('YYYY-MM-DD')}
          ></input>
          {birthError.length > 0 && birthMessage}
        </div>

        <div className="mt-3">
          <h1 className="pb-1 text-center text-lg font-bold text-slate-800">
            Аватар (необов'язково)
          </h1>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => {
              setAvatar(e.target.files![0]);
            }}
            className="hidden h-10 w-[24rem] rounded border-4 border-blue-500 pl-2 outline-2 outline-sky-400 "
            ref={(fInput) => {
              file = fInput;
            }}
          ></input>
          <Button
            onClick={() => {
              file!.click();
            }}
            className="mx-auto"
            success
          >
            Обрати зображення
          </Button>
          {(avatar || avatarPreview.length > 0) && (
            <div className="mt-2 flex min-w-[24rem] ">
              <div className="my-auto w-[29%]">
                <span className="text-left font-bold text-slate-800">
                  Вигляд зображення на сайті
                </span>
              </div>
              <div
                style={{
                  backgroundImage: `url(${avatarPreview})`,
                }}
                className="max-h-[160px] min-h-[160px] min-w-[160px] max-w-[160px] rounded-full bg-cover bg-center shadow shadow-black/40"
              ></div>
            </div>
          )}
        </div>
        {avatarError && avatarMessage}

        <div className="mt-3">
          <h1 className="pb-1 text-center text-lg font-bold text-slate-800">
            Опис (необов'язково)
          </h1>
          <textarea
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className={`${errorOutline(
              descriptionError
            )} h-10 min-h-[80px] w-[24rem] overflow-y-scroll rounded border-4 pl-2 outline-2`}
            placeholder="Вигадайте опис профілю, розкажіть про себе"
            value={description}
          ></textarea>
          {descriptionError && descriptionMessage}
        </div>
        {updateMessage}
      </div>
      <div className="flex w-full justify-center pt-2">
        <Button
          className="hover:brightness-[1.15]"
          danger
          onClick={() => setDeleteAssurance(true)}
        >
          Видалити профіль
        </Button>
      </div>
      {deleteAssurance && (
        <SureMessage
          onClose={setDeleteAssurance}
          actionBar={deleteBar}
          elementName={`видалити свій профіль? Відновити його буде вже неможливо, як і ваші рецензії та листування.`}
        />
      )}
    </Modal>
  );
  return modal;
};

export { Settings };
