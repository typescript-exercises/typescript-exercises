import React from 'react';

export const DirectoryIcon = ({color}: {color: string}) => (
    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
        <path
            d='M0 4C3.22 4 5.24 4 6.04 4C6.43 4 6.8 4.19 7.03 4.51C7.23 4.78 7.71 5.46 8.49 6.54L16 6.54L16 16L0 16L0 4Z'
            fill={color}
        />
    </svg>
);

export const FileIcon = ({color}: {color: string}) => (
    <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width='16' height='16'>
        <path d='M2 10L8 10L8 4L14 4L14 16L2 16' fill={color} />
        <path d='M2 9L7 9L7 4' fill={color} />
    </svg>
);
