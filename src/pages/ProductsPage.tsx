import { GiHamburgerMenu } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { useNavigation } from '../hooks/use-navigation';
import { ProductsList } from '../components/ProductsList';
import { FilterDropdown } from '../components/FilterDropdown';
import { useFilter } from '../hooks/use-filter';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { useGetAllProductsQuery } from '../store/apis/productApis';
import { Product } from '../interfaces/product/Product';
import { Loading } from '../assets/Loading';
import ReactDOM from 'react-dom';

const ProductsPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { filter, service } = useNavigation();
  const [isGrows, setIsGrows] = useState(false);
  const { makeFilter } = useFilter();
  const [products, setProducts] = useState<Product[]>();

  const { data, isSuccess } = useGetAllProductsQuery(service);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
    setSearchText('');
    if (data) {
      setProducts(makeFilter(isGrows, data));
    }
  }, [data]);

  useEffect(() => {
    if (products) {
      setProducts(makeFilter(isGrows, products!));
    }
  }, [filter, isGrows]);

  useEffect(() => {
    if (data) {
      if (searchText === '') {
        setProducts(makeFilter(isGrows, data!));
      } else {
        setProducts(
          makeFilter(
            isGrows,
            data.filter((p) => {
              return p.name.toLowerCase().search(searchText.toLowerCase()) > -1;
            })
          )
        );
      }
    }
  }, [searchText]);

  const handleOrder = () => {
    if (isGrows) {
      setIsGrows(false);
    } else {
      setIsGrows(true);
    }
  };

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const barInfo = (
    <div className="flex w-full flex-col ">
      <div className="flex w-full">
        <div className="w-[5%]"></div>
        <div className="mt-8 w-[90%]">
          <input
            placeholder="уведіть назву"
            className=" flex w-full select-none justify-center text-center shadow-lg outline-dashed outline-emerald-500"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          ></input>
        </div>
        <div className="w-[5%]"></div>
      </div>
      <div className="mt-10 flex w-full">
        <div className="w-[10%]"></div>
        <div
          className="flex h-fit w-[80%] cursor-pointer select-none justify-center"
          onClick={handleOrder}
        >
          <span className="flex rounded-lg bg-slate-600 p-1 text-2xl text-slate-300 duration-100 hover:bg-slate-600/80">
            {isGrows ? (
              <>
                <span className=" my-auto text-xs font-medium">
                  Від меншого
                </span>
                <GoChevronUp />
              </>
            ) : (
              <>
                <span className="my-auto text-xs font-medium">
                  Від більшого
                </span>
                <GoChevronDown />
              </>
            )}
          </span>
        </div>
        <div className="w-[10%]"></div>
      </div>
      <div className="mt-2 w-full">
        <div className="relative mx-auto flex w-[90%] justify-center">
          <div className="absolute w-full text-sm md:text-base">
            <FilterDropdown classNames={'opacity-90'}></FilterDropdown>
          </div>
        </div>
      </div>
    </div>
  );

  const leftBar = ReactDOM.createPortal(
    <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
      <div
        onClick={() => {
          setIsOpen(false);
        }}
        className="fixed inset-0 bg-slate-700 opacity-80"
      ></div>
      <div
        className={`addProductScrollbar fixed inset-y-16 h-full w-[190px] overflow-y-auto bg-slate-400  shadow-lg shadow-black/30`}
      >
        <div className="registrationScrollbar flex flex-col justify-between overflow-y-auto pb-[350px] pt-24">
          {barInfo}
        </div>
      </div>
    </div>,
    document.querySelector('.modal-container')!
  );

  return (
    <div className="h-full bg-slate-300 pb-[48px] pt-[64px]">
      <div className="flex h-full w-full">
        {leftBar}
        <div className="fixed z-20 p-1 pt-12 text-2xl font-bold md:hidden">
          <GiHamburgerMenu
            className="cursor-pointer"
            onClick={() => setIsOpen((cur) => (cur ? false : true))}
          />
        </div>
        <div
          className={`addProductScrollbar hidden h-full w-[14%] min-w-[190px] justify-center overflow-y-auto bg-slate-400 pt-24 md:flex`}
        >
          {barInfo}
        </div>

        <div className="registrationScrollbar flex h-full w-full overflow-hidden overflow-y-auto pl-4 pt-10 md:w-[86%]">
          <div className="w-[2%]"></div>
          <div className="w-[96%] max-w-[96%] ">
            {products && data && isSuccess ? (
              <ProductsList products={products} />
            ) : (
              <div className="flex w-full justify-center">
                <svg>
                  <Loading hexColor="#475569" />
                </svg>
              </div>
            )}
          </div>
          <div className="w-[2%]"></div>
        </div>
      </div>
    </div>
  );
};

export { ProductsPage };
