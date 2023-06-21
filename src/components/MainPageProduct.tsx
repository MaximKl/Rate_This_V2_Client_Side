import classNames from 'classnames';
import { BsSpeedometer2 } from 'react-icons/bs';
import { ImFileText } from 'react-icons/im';
import { Link } from 'react-router-dom';
import { useNavigation } from '../hooks/use-navigation';
import { Product } from '../interfaces/product/Product';
import { useEstimateColor } from '../hooks/use-estimate-color';

interface MainPageProductProps {
  game?: boolean;
  book?: boolean;
  film?: boolean;
  products: Product[];
}

const MainPageProduct: React.FC<MainPageProductProps> = ({
  game,
  book,
  film,
  products,
}) => {
  const { navigate, basePath } = useNavigation();
  const startClassNames = classNames(
    'max-w-[8rem] min-w-[5rem] hover:contrast-[1.15] transition-all duration:500 cursor-pointer rounded-2xl mb-4 text-slate-900',
    {
      'bg-rose-600': game,
      'bg-emerald-600': book,
      'bg-blue-500': film,
    }
  );
  const { chooseBackground } = useEstimateColor();

  const handleClick = (to: string) => {
    navigate(`/${basePath}/${to}`);
  };

  var product = '';
  if (game) {
    product = 'games';
  }
  if (film) {
    product = 'films';
  }
  if (book) {
    product = 'books';
  }

  const productsRender = products?.map((p) => {
    return (
      <div key={p.id} className="pl-4">
        <div className={startClassNames}>
          <Link
            to={`${product}/${p.id}`}
            onClick={() => handleClick(`${product}/${p.id}`)}
          >
            <div className="relative">
              <img
                className="shadow-lg shadow-slate-800/80"
                alt="product_picture"
                src={
                  p.picture.startsWith('link:')
                    ? p.picture.substring(5)
                    : `data:image/jpeg;base64,${p.picture}`
                }
              />
              <div className="absolute bottom-0 right-0 hidden max-w-[8rem] overflow-hidden p-0.5 text-[12px] font-bold text-white sm:flex lg:text-[13px]">
                <BsSpeedometer2 title={p.estimatesQuantity.toLocaleString()} />
                <h1
                  title={p.estimatesQuantity.toLocaleString()}
                  className="truncate pl-1 pr-2 shadow-black text-shadow"
                >
                  {p.estimatesQuantity.toLocaleString()}
                </h1>
                <ImFileText title={p.reviewQuantity.toLocaleString()} />
                <h1
                  title={p.reviewQuantity.toLocaleString()}
                  className="truncate pl-1 shadow-black text-shadow"
                >
                  {p.reviewQuantity.toLocaleString()}
                </h1>
              </div>
              <h1 className={chooseBackground(p.rating)}>{p.rating}</h1>
            </div>

            <div
              className="text-center "
              title={`${p.name} (${new Date(p.releaseDate).getFullYear()})`}
            >
              <h1 className="break-words p-1 text-[12px] font-bold text-slate-900 line-clamp-3 sm:text-lg">
                {p.name}{' '}
                <span className="text-slate-900/50">
                  ({new Date(p.releaseDate).getFullYear()})
                </span>
              </h1>
            </div>
          </Link>
        </div>
      </div>
    );
  });
  return (
    <div className="flex w-full flex-wrap items-center justify-evenly pr-4">
      {productsRender}
    </div>
  );
};

export { MainPageProduct };
