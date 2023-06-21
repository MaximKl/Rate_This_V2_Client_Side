import { ProductMarks } from '../components/productPage/ProductMarks';
import { ProductsCommonInfo } from '../components/productPage/ProductCommonInfo';
import { useNavigation } from '../hooks/use-navigation';
import {
  useGetProductQuery,
  useGetUserReportsQuery,
  useLazyGetAllProductReviewsQuery,
  useLazyGetUserReactionsQuery,
} from '../store/apis/productApis';
import { ReactNode, useEffect, useState } from 'react';
import { Product } from '../interfaces/product/Product';
import { MyReview } from '../components/productPage/MyReview';
import { Review } from '../interfaces/product/Review';
import { CommonReview } from '../components/productPage/CommonReview';
import { Report } from '../interfaces/product/Report';
import { Reaction } from '../interfaces/product/Reaction';
import { Loading } from '../assets/Loading';
import { Pathes } from '../store/Pathes';

const ProductPage: React.FC = () => {
  const { currentPath, isAuthorized, user } = useNavigation();
  const [renderProduct, setRenderProduct] = useState<Product>();
  const [renderReviews, setRenderReviews] = useState<Review[]>([]);
  const [reactions, setRenderReactions] = useState<Reaction[]>([]);
  const [isNotFound, setIsNotFound] = useState(false);
  const { data, error } = useGetProductQuery(
    `${currentPath.split('/')[2]}/${currentPath.split('/')[3]}`
  );
  const [getReactions, reactionsResponse] = useLazyGetUserReactionsQuery();
  const reports = useGetUserReportsQuery(user);
  const [getReviews, reviewsResponse] = useLazyGetAllProductReviewsQuery();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (data) {
      setRenderProduct(data);
      getReviews(data.id);
      if (user) {
        getReactions(user);
      }
    }
  }, [data, user, getReactions, getReviews]);

  useEffect(() => {
    if (error) {
      Pathes.getErrorCode(error) === 404 && setIsNotFound(true);
    }
  }, [error]);

  useEffect(() => {
    if (reactionsResponse.data) setRenderReactions(reactionsResponse.data);
  }, [reactionsResponse]);

  useEffect(() => {
    if (reviewsResponse.data) {
      setRenderReviews(reviewsResponse.data);
    }
  }, [reviewsResponse]);

  var review: Review | undefined = undefined;
  var reviews: ReactNode | undefined = undefined;
  var border = '';
  if (renderProduct) {
    if (renderProduct.type === 'BOOK') {
      border = 'border-green-600';
    }
    if (renderProduct.type === 'GAME') {
      border = 'border-rose-600';
    }
    if (renderProduct.type === 'FILM') {
      border = 'border-blue-600';
    }

    review = renderReviews.filter((r) => r.name === user?.username)[0];

    reviews = renderReviews
      .slice()
      .sort((r1, r2) => r2.like - r2.dislike - (r1.like - r1.dislike))
      .map((r) => {
        var isLike = false;
        var isDislike = false;
        if (reactions) {
          if (reactions.length > 0) {
            var reaction = reactions.filter(
              (reaction) => reaction.reviewId === r.id
            );
            if (reaction.length > 0) {
              reaction[0].isLike ? (isLike = true) : (isDislike = true);
            }
          }
        }

        var report: Report | undefined = undefined;
        var reportFilter = undefined;
        if (!reports.isError) {
          if (reports.data) {
            if (reports.data.length > 0) {
              reportFilter = reports.data.filter(
                (report) => report.reviewId === r.id
              );
              if (reportFilter.length > 0) report = reportFilter[0];
            }
          }
        }
        return (
          <CommonReview
            key={r.id}
            review={r}
            isLike={isLike}
            isDislike={isDislike}
            productId={renderProduct.id}
            productType={renderProduct.type}
            report={report}
          />
        );
      });
  }

  return (
    <div className="min-h-full pt-[64px]">
      <div className="min-h-[700px] bg-slate-300">
        <div className="flex flex-col items-center pb-10 xl:flex-row xl:items-start">
          <div className="w-[2%]"></div>
          <div className="relative w-full pb-10 pt-10 xl:w-[66%]">
            {renderProduct ? (
              <ProductsCommonInfo product={renderProduct} />
            ) : !isNotFound ? (
              <svg>
                <Loading hexColor="#475569" />
              </svg>
            ) : (
              <h1 className="select-none pt-36 text-center text-7xl font-bold text-slate-600/50">
                ТАКОГО ПРОДУКТУ НЕ ІСНУЄ
              </h1>
            )}
          </div>
          <div className="flex w-[90%] justify-center xl:w-[30%] xl:pt-20">
            {renderProduct ? (
              <ProductMarks
                product={renderProduct}
                authorization={isAuthorized}
              />
            ) : (
              !isNotFound && (
                <svg>
                  <Loading hexColor="#475569" />
                </svg>
              )
            )}
          </div>
          <div className="w-[2%]"></div>
        </div>
      </div>
      <div
        className={`min-h-screen border-t-8 border-dashed bg-slate-600 py-10 ${border}`}
      >
        <div className="flex justify-center">
          {isAuthorized ? (
            <MyReview
              review={review}
              productType={renderProduct ? renderProduct.type : ''}
              productId={renderProduct ? renderProduct.id : 0}
            />
          ) : (
            <h1 className=" mb-10 select-none text-center text-2xl font-bold text-slate-200">
              Авторизуйтеся для написання рецензії
            </h1>
          )}
        </div>
        <div className="flex flex-col items-center justify-center">
          <h1 className=" mb-9 border-b-4 pb-1 text-center text-4xl font-semibold text-slate-200">
            Огляди інших користувачів
          </h1>
          {reviews && reviewsResponse.isSuccess
            ? reviews
            : !isNotFound && (
                <svg>
                  <Loading hexColor="#e2e8f0" />
                </svg>
              )}
        </div>
      </div>
    </div>
  );
};

export { ProductPage };
