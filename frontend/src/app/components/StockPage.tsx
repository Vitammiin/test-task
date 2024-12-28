'use client';

import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import Stocks from './Table';

function Page() {
  const [country, setCountry] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');

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

  return (
    <div className="flex flex-col text-center justify-center">
      <Input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{
          ...inputStyle,
          marginTop: '150px',
        }}
        placeholder="Enter your country"
        classNames={{
          input: 'placeholder:text-white',
        }}
      />
      <Input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        style={{
          ...inputStyle,
          marginTop: '27px',
        }}
        placeholder="Enter symbol or name"
        classNames={{
          input: 'placeholder:text-white',
        }}
      />
      <Stocks country={country} symbol={symbol} />
    </div>
  );
}

export default Page;
