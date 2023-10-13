import React from 'react';

import Card from 'react-bulma-companion/lib/Card';
import Content from 'react-bulma-companion/lib/Content';

type Props = { closeModal: () => void, deleteTodo: () => void };

export default function ConfirmDeleteTodo({ closeModal, deleteTodo }:Props) {
  return (
    <Card>
      <Card.Content>
        <Content className="has-text-centered">
          Are you sure you wanted to delete this item?
        </Content>
      </Card.Content>
      <Card.Footer>
        <Card.FooterItem onClick={closeModal} onKeyPress={closeModal}>
          Cancel
        </Card.FooterItem>
        <Card.FooterItem onClick={deleteTodo} onKeyPress={deleteTodo}>
          Delete
        </Card.FooterItem>
      </Card.Footer>
    </Card>
  );
}
