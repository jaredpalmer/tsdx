import React, { useRef, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import 'intersection-observer';

export default ({ src, caption, ratio }) => {
  const [inViewRef, inView] = useInView({
    threshold: 1,
  });
  const videoRef = useRef();

  const setRefs = useCallback(
    node => {
      // Ref's from useRef needs to have the node assigned to `current`
      videoRef.current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      inViewRef(node);

      if (node) {
        node.addEventListener('click', function() {
          if (this.paused) {
            this.play();
          } else {
            this.pause();
          }
        });
      }
    },
    [inViewRef]
  );

  useEffect(() => {
    if (!videoRef || !videoRef.current) {
      return;
    }

    if (inView) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [inView]);

  return (
    <figure>
      <div style={{ paddingBottom: ratio * 100 + '%' }} />
      <video loop muted autoPlay playsInline ref={setRefs}>
        <source src={src} type="video/mp4" />
      </video>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
