'use client';

import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

type LoadingComponentProps = {};

const Loading = ({}: LoadingComponentProps) => {
  return (
    <div>
      <p>Loading...Please wait</p>
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
