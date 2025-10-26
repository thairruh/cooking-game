import React, { useMemo } from 'react';
import { animated, useTransition } from '@react-spring/web'; // ✅ correct modern import
import { makeStyles } from '@mui/styles'; // or '@material-ui/core/styles' if you're on MUI v4


const useStyles = makeStyles(() => ({
  dialogMessage: {
    fontSize: '12px',
    textTransform: 'uppercase' as const,
  },
}));


export interface MessageProps {
  /** text to display (the dialogue line) */
  message?: string;
  /** delay between letters (ms) */
  trail?: number;
  /** callback when the typing animation ends */
  onMessageEnded?: () => void;
  /** skip animation and instantly show full message */
  forceShowFullMessage?: boolean;
  /** optional prop (used in parent, even if unused here) */
  action?: string;
}

interface LetterItem {
  item: string;
  key: number;
}


const Message: React.FC<MessageProps> = ({
  message = '',
  trail = 35,
  onMessageEnded = () => {},
  forceShowFullMessage = false,
}) => {
  const classes = useStyles();

  // split text into letters only when message changes
  const items = useMemo<LetterItem[]>(
    () =>
      message
        .trim()
        .split('')
        .map((letter, index) => ({
          item: letter,
          key: index,
        })),
    [message]
  );

  // letter-by-letter animation
  const transitions = useTransition(items, {
    trail,
    from: { display: 'none' },
    enter: { display: '' },
    keys: (it) => it.key,
    onRest: (_result, _ctrl, item) => {
      if (item && item.key === items.length - 1) onMessageEnded();
    },
  });

  return (
    <div className={classes.dialogMessage}>
      {forceShowFullMessage ? (
        <span>{message}</span>
      ) : (
        transitions((styles, { item, key }) => (
          <animated.span
            key={key}
            style={styles as unknown as React.CSSProperties}
          >
            {item}
          </animated.span>
        ))
      )}
    </div>
  );
};

export default Message;
