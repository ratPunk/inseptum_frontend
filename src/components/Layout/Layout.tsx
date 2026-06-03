import React from 'react';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;