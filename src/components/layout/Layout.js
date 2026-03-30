import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import TrailerModal from 'components/common/TrailerModal';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <Footer />
      <TrailerModal />
    </div>
  );
};

export default Layout;
