import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

const AlertBox = ({message}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => clearTimeout(timeout);
  }, []);

  return  (
    visible?
      <div className="alert">
        {message}<FontAwesomeIcon style={{marginLeft: '27px'}} icon={faCheckCircle} />
      </div>
    : null
  )
};

export default AlertBox;
