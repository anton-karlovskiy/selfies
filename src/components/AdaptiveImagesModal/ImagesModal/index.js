
import React from 'react';
// TODO: package duplication -> react-ideal-image
// RE: https://bundlephobia.com/result?p=react-images@1.1.7
import Carousel, { Modal, ModalGateway } from 'react-images';

const ImagesModal = ({
  views,
  onClose,
  currentIndex
}) => (
  <ModalGateway>
    <Modal onClose={onClose}>
      <Carousel views={views} currentIndex={currentIndex} />
    </Modal>
  </ModalGateway>
);

export default ImagesModal;
