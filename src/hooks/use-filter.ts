import { Product } from '../interfaces/product/Product';
import { useNavigation } from './use-navigation';

const useFilter = () => {
  const { filter } = useNavigation();
  const makeFilter = (isGrows: boolean, productsToFilter: Product[]) => {
    var array: Product[] = [];
    const multiple = isGrows ? 1 : -1;

    if (filter === 'popular' || filter === '') {
      array.push(
        ...productsToFilter.slice().sort((p1, p2) => {
          return (p1.estimatesQuantity - p2.estimatesQuantity) * multiple;
        })
      );
    }
    if (filter === 'release') {
      array.push(
        ...productsToFilter.slice().sort((p1, p2) => {
          return (
            (new Date(p1.releaseDate).getTime() -
              new Date(p2.releaseDate).getTime()) *
            multiple
          );
        })
      );
    }
    if (filter === 'add') {
      array.push(
        ...productsToFilter.slice().sort((p1, p2) => {
          return (
            (new Date(p1.addDate!).getTime() -
              new Date(p2.addDate!).getTime()) *
            multiple
          );
        })
      );
    }
    if (filter === 'mark') {
      array.push(
        ...productsToFilter.slice().sort((p1, p2) => {
          return (p1.rating - p2.rating) * multiple;
        })
      );
    }
    return array;
  };
  return { makeFilter };
};

export { useFilter };
