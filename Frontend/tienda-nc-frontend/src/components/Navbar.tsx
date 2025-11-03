import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles';
import { navLinks } from '../Constants/Index' ;
import menu from '../assets/menu.svg';
import close from '../assets/close.svg';

export const Navbar = () => {
  // const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const [toggle, setToggle] = useState(false);
  // //const { isAuthenticated, user } = useAuthStore();
  // const { logout } = useAuth();
  // const navigate = useNavigate();
  const [active, setActive] = useState("'");

  // const handleLogout = () => {
  //   logout();
  //   navigate('/');
  //   setIsUserMenuOpen(false);
  // };

  return (
      <nav className="w-full fixed top-0 z-20 bg-primary py-5">
        <div className="flex justify-center">
          <div className={`${styles.paddingX} max-w-7xl w-full flex justify-between items-center`}>
            <Link to="/" className="flex items-center gap-2" onClick={() => {setActive(""); window.scrollTo(0, 0)}}>
              <p className="text-white text-[18px] font-bold cursor-pointer flex">Nicoll &nbsp;<span className="sm:block hidden">Candamil Boutique</span></p>
            </Link>
            <ul className="list-none hidden sm:flex flex-row gap-10">
              {navLinks.map((link) => (
                <li key={link.id} className={`${active === link.title ? "text-white" : "text-secondary"} hover:text-white text-[18px] font-medium cursor-pointer`} onClick={() => setActive(link.title)}>
                  {link.href.startsWith('/') ? (
                    <Link to={link.href}>{link.title}</Link>
                  ) : (
                    <a href={link.href}>{link.title}</a>
                  )}
                </li>
              ))}
            </ul>
            <div className="sm:hidden flex flex-1 justify-end items-center">
              <img
                src={toggle ? close : menu}
                alt="menu"
                className="w-[28px] h-[28px] object-contain cursor-pointer"
                onClick={() => setToggle(!toggle)}
              />
              <div className={`${!toggle ? "hidden" : "flex"} p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
                <ul className="list-none flex justify-end items-start flex-col gap-4">
                  {navLinks.map((link) => (
                    <li key={link.id} className={`${active === link.title ? "text-white" : "text-secondary"} font-poppins font-medium cursor-pointer text-[16px]`} onClick={() => {setToggle(!toggle); setActive(link.title)}}>
                      {link.href.startsWith('/') ? (
                        <Link to={link.href}>{link.title}</Link>
                      ) : (
                        <a href={link.href}>{link.title}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>


  );
};

export default Navbar;
