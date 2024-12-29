'use client';

import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

type LoadingComponentProps = {};

const Loading = ({}: LoadingComponentProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-slate-50">Loading...Please wait</p>
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        barColor="#9c56a9"
        borderColor="#b79e9d"
        ariaLabel="progress-bar-loading"
      />
    </div>
  );
};

export default Loading;
