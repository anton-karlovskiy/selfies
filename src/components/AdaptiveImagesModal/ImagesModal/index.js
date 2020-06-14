
import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

const ImagesModal = ({ images, isOpen, close, currentIndex }) => {
  return (
    <ModalGateway>
      { isOpen ? (
        <Modal onClose={close}>
          <Carousel views={images} currentIndex={currentIndex} />
        </Modal>
      ) : null }
    </ModalGateway>
  );
};

export default ImagesModal;
