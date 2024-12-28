'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@nextui-org/react';
import StocksTable from './StocksTable';

function StocksPage() {
  const [country, setCountry] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [submittedCountry, setSubmittedCountry] = useState<string>('');
  const [submittedSymbol, setSubmittedSymbol] = useState<string>('');

  const inputStyle = {
    width: '282px',
    height: '32px',
    paddingLeft: '18px',
    paddingRight: '18px',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: '20px',
    background: 'none',
    color: 'white',
    boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    border: '2px solid var(--colors-base-default-400, rgba(161, 161, 170, 1))',
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedCountry(country);
    setSubmittedSymbol(symbol);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  const handleSymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  useEffect(() => {
    handleSubmit({
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>);
  }, [country, symbol]);

  return (
    <div className="pt-20">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col text-center justify-center"
      >
        <Input
          type="text"
          value={country}
          onChange={handleCountryChange}
          style={{
            ...inputStyle,
            marginTop: '80px',
          }}
          placeholder="Enter your country"
          classNames={{
            input: 'placeholder:text-white',
          }}
        />

        <Input
          type="text"
          value={symbol}
          onChange={handleSymbolChange}
          style={{
            ...inputStyle,
            marginTop: '27px',
          }}
          placeholder="Enter symbol or name"
          classNames={{
            input: 'placeholder:text-white',
          }}
        />

        <StocksTable country={country} symbol={symbol} />
      </form>
    </div>
  );
}

export default StocksPage;
