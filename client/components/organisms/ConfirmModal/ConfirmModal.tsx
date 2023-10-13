import React from 'react';

import Modal from 'react-bulma-companion/lib/Modal';
import ConfirmDeleteTodo from '../ConfirmDeleteTodo';

type Props = { confirm: boolean, closeModal: () => void, deleteTodo: () => void };

export default function ConfirmModal({ confirm, closeModal, deleteTodo }:Props) {
  return (
    <Modal className="confirm-modal" active={confirm}>
      <Modal.Background />
      <Modal.Content>
        <ConfirmDeleteTodo closeModal={closeModal} deleteTodo={deleteTodo} />
      </Modal.Content>
      <Modal.Close size="large" aria-label="close" onClick={closeModal} />
    </Modal>
  );
}
