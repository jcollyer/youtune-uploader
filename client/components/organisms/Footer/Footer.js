import React from 'react';

export default function FooterComponent() {
  const year = new Date().getFullYear();

  return (
    <footer className="p-10 bg-slate-800 text-center text-white">
      <p>{`Copyright Ⓒ ${year} Carrot Cake. All Rights Reserved.`}</p>
    </footer>
  );
}
