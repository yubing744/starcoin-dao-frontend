import deepEqual from 'deep-eql';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Web3 from 'web3';

const PosterEncoder = props => {
  const {
    localForm: { watch, setValue },
  } = props;
  const { daoid } = useParams();

  const posterData = watch('posterData');
  const prev = useRef(null);

  useEffect(() => {
    if (!deepEqual(prev.current, posterData)) {
      //  REVIEW
      // This is a little heavy and does cause some lag
      //  Once we decide on the format for the boost
      //  I can recode this to use argFromCallback
      //  so that we only do this on submit
      setValue(
        'encoded',
        JSON.stringify({
          ...posterData,
          content: Web3.utils.toHex(posterData?.content),
          molochAddress: daoid,
          contentType: 'encoded',
        }),
      );
      prev.current = posterData;
    }
  }, [posterData]);

  return null;
};

export default PosterEncoder;
