import React from 'react';

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <footer className="p-6 bg-gray-300 text-center">
      <p>{`Copyright Ⓒ ${year} Carrot Cake. All Rights Reserved.`}</p>
    </footer>
  );
}
