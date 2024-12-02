'use client';

import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { fetchStockData } from '../../services/commonAPI';

import { validationSchema } from '@/shared/helpers/validation-schema';

import Section from '@/shared/components/Section';
import Container from '@/shared/components/Container';
import FormItem from '@/shared/components/FormItem';
import Button from '@/shared/components/Button';

interface StockDataProps {
  symbol: string;
  name: string;
  capitalization: string;
  price: string;
  priceChangeDay: string;
  priceChangeMonth: string;
}

interface FormDataProps {
  country?: string;
  symbolName: string;
}

export default function ShowStock() {
  const [stockData, setStockData] = useState<StockDataProps | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful, errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema()),
  });

  const onSubmit: SubmitHandler<FormDataProps> = data => {
    fetchStockDataHandler(data.symbolName || '', data.country || 'US');
  };

  const fetchStockDataHandler = async (symbol: string, country: string) => {
    setStockData(null);
    setLoading(true);

    try {
      const stock = await fetchStockData(symbol, country);
      setStockData(stock);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <Container>
      <Section styles="p-0 xl:px-60 bg-transperent">
        <div className="flex flex-col items-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 max-w-[282px] mb-[86px] font-Inter-400 font-normal text-sm"
          >
            <FormItem
              type="text"
              name="country"
              placeholder="Enter your country"
              register={register}
              error={errors.country}
            />
            <FormItem
              type="text"
              name="symbolName"
              placeholder="Enter symbol or name *"
              register={register}
              error={errors.symbolName}
            />

            <Button type="submit" styles={'rounded-lg'}>
              Search
            </Button>
          </form>

          <div className="overflow-auto w-full">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Capitalization</th>
                  <th>Price</th>
                  <th>Price change per day</th>
                  <th>Price change per month</th>
                </tr>
              </thead>
              <tbody>
                {loading || !stockData ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      {loading ? 'Loading...' : null}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td>1</td>
                    <td>{stockData.symbol || 'N/A'}</td>
                    <td>{stockData.name || 'N/A'}</td>
                    <td>{stockData.capitalization || 'N/A'}</td>
                    <td>{stockData.price || 'N/A'}</td>
                    <td
                      className={`${
                        stockData.priceChangeDay &&
                        parseFloat(stockData.priceChangeDay) > 0
                          ? 'text-green-500'
                          : stockData.priceChangeDay &&
                            parseFloat(stockData.priceChangeDay) < 0
                          ? 'text-red-500'
                          : 'text-mainPrimaryText'
                      }`}
                    >
                      {stockData.priceChangeDay ? (
                        <>
                          {parseFloat(stockData.priceChangeDay) > 0 ? '+' : ''}
                          {stockData.priceChangeDay}%
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td
                      className={`${
                        stockData.priceChangeMonth &&
                        parseFloat(stockData.priceChangeMonth) > 0
                          ? 'text-green-500'
                          : stockData.priceChangeMonth &&
                            parseFloat(stockData.priceChangeMonth) < 0
                          ? 'text-red-500'
                          : 'text-mainPrimaryText'
                      }`}
                    >
                      {stockData.priceChangeMonth ? (
                        <>
                          {parseFloat(stockData.priceChangeMonth) > 0
                            ? '+'
                            : ''}
                          {stockData.priceChangeMonth}%
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </Container>
  );
}
