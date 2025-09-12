"use client";

import { useState } from "react";
// import { Moon, Sun, Menu, X, Bell } from "lucide-react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "./Navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";
import LocaleSwitcher from "./Lang";
import { useAuth } from "@/hooks/useAuth";
import { NotificationIcon } from "./NotificationIcon";
import { useTranslation } from "react-i18next";
// import { useLanguage } from "@/context/LanguageContext";


export default function Header() {
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();
  // const { isRTL } = useLanguage();

  const { user, logout } = useAuth();

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle("dark");
  // };

  return (
    <header className="bg-white dark:bg-gray-950 shadow-md">
      <div className="container max-w-7xl mx-auto flex items-center justify-between p-4">
        <Logo />
        {/* Navbar (Desktop) */}
        {user && <Navigation user={user} atherClasses="max-lg:hidden space-x-6" />}

        {/* Icons */}
        <div className="flex items-center space-x-4">
          {/* Language */}
          <LocaleSwitcher />

          {/* Dark Mode */}
          {/* <button
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button> */}

          {/* Notification */}
          {user && <NotificationIcon />}

          {/* User / Auth */}
          {user ? (
            <>
              <Link href={"/profile"} className="flex items-center space-x-1 cursor-pointer">
                <span className="w-8 h-8 rounded-full border bg-blue-400 flex justify-center items-center text-white">{user.name[0].toUpperCase()}</span>
                <span className="text-sm font-medium">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {t('common.logout')}
              </button>
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuMobileOpen(!menuMobileOpen)}
                className="lg:hidden p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {menuMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="outline">{t('common.login')}</Button>
              </Link>
              <Link href="/register">
                <Button>{t('common.getStarted')}</Button>
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Mobile Navbar with Animation */}
      {user && <AnimatePresence>
        {menuMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 absolute w-full"
          >
            <Navigation user={user} atherClasses="lg:hidden flex-col space-y-4 p-4 w-full" />
          </motion.div>
        )}
      </AnimatePresence>}
    </header>
  );
}
