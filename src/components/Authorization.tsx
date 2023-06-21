import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { RxCrossCircled } from 'react-icons/rx';
import { useState, useEffect } from 'react';
import { useRegistrationMutation } from '../store/apis/authorizationApis';
import { useNavigation } from '../hooks/use-navigation';
import moment from 'moment';

interface AuthorizationProps {
  isOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Authorization: React.FC<AuthorizationProps> = ({ isOpen }) => {
  const [onRegistration, setOnRegistration] = useState(false);

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

  const [registrate, regResponse] = useRegistrationMutation();
  const { authorization, response } = useNavigation();
  const [registrationStatus, setRegistrationStatus] = useState(0);

  const testEmail = (mail: string) => {
    const expression: RegExp =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return expression.test(mail);
  };

  useEffect(() => {
    if (response === 200) {
      isOpen(false);
    }
  }, [response]);

  useEffect(() => {
    if (regResponse.isSuccess) {
      setRegistrationStatus(200);
    } else if (regResponse.error) {
      if ('status' in regResponse.error!) {
        if (
          (regResponse.error.status as number) === 409 &&
          //@ts-ignore
          regResponse.error.data.detail.startsWith(`this name`)
        ) {
          setRegistrationStatus(409);
          return;
        }
        if (
          (regResponse.error.status as number) === 409 &&
          //@ts-ignore
          regResponse.error.data.detail.startsWith(`this email`)
        ) {
          setRegistrationStatus(410);
          return;
        }
        setRegistrationStatus(regResponse.error.status as number);
      }
    }
  }, [regResponse]);

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
    const expression: RegExp = /[A-Z]/;
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

  const passwordAuthMessage = (
    <h1 className="font-bold text-rose-700">Мінімум 6 символів</h1>
  );

  const descriptionMessage = (
    <h1 className="font-bold text-rose-700">Не більше 2000 символів</h1>
  );

  const registeredMessage = (
    <>
      {registrationStatus === 200 && (
        <h1 className="font-bold text-emerald-700">
          Вас успішно зареєстровано! Тепер можете увійти.
        </h1>
      )}
      {registrationStatus === 500 && (
        <h1 className="font-bold text-rose-700">
          Сталася помилка при збережені даних. Спробуйте ще раз.
        </h1>
      )}
      {registrationStatus === 404 && (
        <h1 className="font-bold text-rose-700">
          Помилка валідації даних при реєстрації.
        </h1>
      )}
      {registrationStatus === 409 && (
        <h1 className="font-bold text-rose-700">
          Користувача з таким іменем вже зареєстровано.
        </h1>
      )}
      {registrationStatus === 410 && (
        <h1 className="font-bold text-rose-700">
          Користувача з такою поштою вже зареєстровано.
        </h1>
      )}
    </>
  );

  const authorizeMessage = (
    <h1 className="font-bold text-rose-700">
      {response === 401 && 'Невірний пароль'}
      {response === 404 && 'Такого користувача не зареєстровано'}
    </h1>
  );

  const errorOutline = (isError: boolean): string => {
    return isError
      ? 'outline-red-400  border-rose-500'
      : 'outline-sky-400  border-blue-500';
  };

  const checkForErrors = () => {
    if (onRegistration)
      return (
        emailError ||
        nickError.length > 0 ||
        birthError.length > 0 ||
        passwordError.length > 0 ||
        repeatPasswordError ||
        avatarError ||
        descriptionError
      );
    else {
      return (nickError.length > 0 && !testEmail(nick)) || password.length < 6;
    }
  };

  let file: HTMLInputElement | null = null;

  const registrationFields = (
    <>
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
          className=" hidden h-10 w-[24rem] rounded border-4 border-blue-500 pl-2 outline-2 outline-sky-400 "
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
        {avatar && (
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
    </>
  );

  const actionBar = (
    <Button
      className={`${
        checkForErrors()
          ? ' cursor-not-allowed'
          : 'shadow shadow-black/60 duration-150 hover:brightness-[1.20]'
      }`}
      onClick={() => {
        if (checkForErrors()) {
          return;
        }
        if (!onRegistration) {
          authorization({
            username: nick,
            password,
            device: navigator.userAgent,
          });
          return;
        } else {
          setOnRegistration(false);
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
              registrate({ ...userProfile, avatar: image });
            };
          } else {
            registrate(userProfile);
          }
        }
      }}
      primary={!checkForErrors()}
      secondary={checkForErrors()}
    >
      {onRegistration && 'ЗАРЕЄСТРУВАТИСЯ'}
      {!onRegistration && 'УВІЙТИ'}
    </Button>
  );

  const modal = (
    <Modal onRegister={onRegistration} onClose={isOpen} actionBar={actionBar}>
      <div className="relative mb-4 flex h-fit justify-center">
        <h1 className=" text-2xl font-bold uppercase text-slate-700 underline">
          {onRegistration && 'Реєстрація'}
          {!onRegistration && 'Авторизація'}
        </h1>
        <RxCrossCircled
          onClick={() => {
            isOpen(false);
          }}
          className="absolute right-0 cursor-pointer text-3xl font-extrabold text-slate-800 duration-150 hover:text-slate-600"
        />
      </div>

      <div className="flex w-full flex-col  items-center justify-center">
        <div className="mb-3">
          <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
            {onRegistration && 'Нікнейм'}
            {!onRegistration && 'Електронна пошта або нікнейм'}
          </h1>
          {onRegistration && (
            <>
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
            </>
          )}

          {!onRegistration && (
            <>
              <input
                onChange={(e) => {
                  setNick(e.target.value);
                }}
                type="email"
                className={`${errorOutline(
                  nickError.length > 0 && !testEmail(nick)
                )} h-10  w-[24rem] rounded border-4 pl-2 outline-2 `}
                placeholder="Ваша електронна пошта або нікнейм"
                value={nick}
              ></input>
              {nickError.length > 0 && !testEmail(nick) && nickMessage}
            </>
          )}
        </div>
        {onRegistration && (
          <div className="mb-3">
            <h1 className=" pb-1 text-center text-lg font-bold text-slate-800">
              Електронна пошта
            </h1>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              className={`${errorOutline(
                emailError
              )} h-10 w-[24rem] rounded border-4 pl-2 outline-2`}
              placeholder="Ваша електронна пошта"
              value={email}
            ></input>
            {emailError && emailMessage}
          </div>
        )}
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
              onRegistration && passwordError.length > 0
            )} ${errorOutline(
              !onRegistration && password.length < 6
            )} h-10 w-[24rem] rounded border-4 pl-2 outline-2`}
            placeholder="Ваш пароль"
            value={password}
          ></input>
          {onRegistration && passwordError.length > 0 && passwordMessage}
          {!onRegistration && password.length < 6 && passwordAuthMessage}
        </div>
        {onRegistration && registrationFields}
        {!onRegistration && registrationStatus !== 0 && registeredMessage}
        {!onRegistration && response !== 200 && authorizeMessage}
        <div className="">
          <h1
            onClick={() => {
              onRegistration
                ? setOnRegistration(false)
                : setOnRegistration(true);
            }}
            className="mt-4 cursor-pointer select-none pb-1 text-center text-lg font-bold text-fuchsia-800 underline duration-150 hover:brightness-[1.40]"
          >
            {!onRegistration && 'Зареєструватися'}
            {onRegistration && 'Увійти'}
          </h1>
        </div>
      </div>
    </Modal>
  );
  return modal;
};

export { Authorization };
