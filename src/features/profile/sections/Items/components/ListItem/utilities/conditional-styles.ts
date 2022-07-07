const conditionalStyles = ({
  isCategory,
  isDragging,
  isDropzone,
  isOverlay,
}: {
  isCategory?: boolean;
  isDragging?: boolean;
  isDropzone?: boolean;
  isOverlay?: boolean;
}) => {
  const focusOrHoverStyles = {
    '.sortable-item__delete': { opacity: 1, zIndex: 1 },
  };

  const containerStyles = {
    bg: 'initial',
    fontWeight: 'normal',
    opacity: '1',
    py: 0,
  };

  if (isOverlay) {
    containerStyles.bg = isCategory ? 'bgSecondaryHover' : 'bgSecondaryActive';
  }

  if (isDropzone) {
    containerStyles.bg = 'bgSecondaryHover';
  }

  if (isDragging) {
    containerStyles.opacity = '0';
  }

  if (isCategory) {
    containerStyles.fontWeight = 'bold';
    containerStyles.py = 2;
  }

  return { containerStyles, focusOrHoverStyles };
};

export default conditionalStyles;
