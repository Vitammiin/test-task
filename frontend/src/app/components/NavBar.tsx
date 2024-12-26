'use client';
import NavBarItem from './NavBarItem';

const NavBar = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg rounded-xl px-6">
      <ul className="flex items-center justify-between h-16 gap-5">
        <NavBarItem pathname="/form">Form</NavBarItem>
        <NavBarItem pathname="/">Audio</NavBarItem>
        <NavBarItem pathname="/stock">Stock</NavBarItem>
      </ul>
    </nav>
  );
};

export default NavBar;
