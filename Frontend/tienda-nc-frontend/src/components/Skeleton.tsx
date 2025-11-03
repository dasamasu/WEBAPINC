import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height 
}) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Skeleton height={192} className="w-full" />
      <div className="p-4">
        <Skeleton height={20} className="w-3/4 mb-2" />
        <Skeleton height={16} className="w-full mb-2" />
        <Skeleton height={16} className="w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton height={24} width={80} />
          <Skeleton height={32} width={100} />
        </div>
      </div>
    </div>
  );
};

export const UserRowSkeleton: React.FC = () => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Skeleton height={40} width={40} className="rounded-full mr-4" />
          <Skeleton height={16} width={120} />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton height={16} width={180} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton height={20} width={80} className="rounded-full" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton height={16} width={100} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-2">
          <Skeleton height={32} width={32} className="rounded-lg" />
          <Skeleton height={32} width={32} className="rounded-lg" />
          <Skeleton height={32} width={32} className="rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export default Skeleton;
