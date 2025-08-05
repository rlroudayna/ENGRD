// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Ce composant fournit la mise en page de base pour les pages publiques
// en incluant la Navbar et le Footer. L'Outlet rendra les pages enfants.
const Layout = () => {
  return (
    <> 
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
