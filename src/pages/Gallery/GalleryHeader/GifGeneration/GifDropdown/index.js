
import React, { useMemo } from 'react';

import Dropdown from 'components/UI/Dropdown';
import config from 'config';

const GifDropdown = ({
  disabled,
  loading,
  createGif,
  openLoadingGif,
  closeLoadingGif
}) => {
  const listItems = useMemo(() => config.GIF_SIZES.map(GIF_SIZE => ({
    id: GIF_SIZE.LABEL.toLowerCase(),
    label: GIF_SIZE.LABEL,
    onClick: async () => {
      openLoadingGif();
      await createGif(GIF_SIZE.WIDTH, `${config.GIF_NAME_PREFIX}-${GIF_SIZE.LABEL.toLowerCase()}.gif`);
      closeLoadingGif();
    }
  })), [createGif, openLoadingGif, closeLoadingGif]);

  return (
    <Dropdown
      disabled={disabled}
      loading={loading}
      listItems={listItems} />
  );
};

export default GifDropdown;
