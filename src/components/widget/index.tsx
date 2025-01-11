import React from 'react';
import classNames from 'classnames';
import Button from '../subcomponents/button';

interface DashboardWidgetProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  className?: string;
  path?: string;
  footer?: React.ReactNode;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  children,
  icon,
  color = 'blue',
  className = '',
  path,
  footer,
}) => {
  const widgetClasses = classNames(
    'p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800',
    {
      'border-t-4 border-blue-500': color === 'blue',
      'border-t-4 border-green-500': color === 'green',
      'border-t-4 border-yellow-500': color === 'yellow',
      'border-t-4 border-red-500': color === 'red',
    },
    className
  );

  return (
    <div className={widgetClasses}>
      <div className="flex items-center mb-4">
        {icon && <div className="mr-2 text-xl">{icon}</div>}
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      </div>
      <div className="mb-4 text-xl font-bold text-orange-400">{children}</div>
      {footer && <div className="mt-4 border-t pt-4 text-sm text-gray-500 dark:text-gray-400">{footer}</div>}

      {
        path &&

        <div className="mt-2">
          <Button text='View' onClick={() => { window.location.href = path }} />
        </div>
      }
    </div>
  );
};

export default DashboardWidget;
