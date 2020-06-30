
import React, { useMemo } from 'react';

import Dropdown from 'components/UI/Dropdown';
import config from 'config';

const GifDropdown = ({ createGif }) => {
  const listItems = useMemo(() => config.GIF_SIZES.map(GIF_SIZE => ({
    id: GIF_SIZE.LABEL.toLowerCase(),
    label: GIF_SIZE.LABEL,
    onClick: () => {
      createGif(GIF_SIZE.WIDTH);
    }
  })), [createGif]);

  return <Dropdown listItems={listItems} />;
};

export default GifDropdown;
