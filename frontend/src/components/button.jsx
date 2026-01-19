import React from 'react';
import clsx from 'clsx';

const Button = ({ icon, label, type = "button", className, onClick }) => {
    return (
        <button type={type} className={clsx("px-2 py-2 outline-none", className)} onClick={onClick}>
            <span>{label}</span>
            {icon && icon}
        </button>
    );
};

// Button.propTypes = {
//     label: PropTypes.string,
//     type: PropTypes.string,
//     className: PropTypes.string,
//     icon: PropTypes.node,
//     onClick: PropTypes.func
// };

export default Button;