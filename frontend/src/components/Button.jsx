import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ variant = 'primary', children, ...props }) => {
  const baseStyles = 'py-2 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50';

  const variants = {
    primary: 'bg-primary text-text-main hover:bg-opacity-80',
    secondary: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-text-main',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.node.isRequired,
};

export default Button;
