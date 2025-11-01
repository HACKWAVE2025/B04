import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { navItems, workflowFeatures } from "../Utils/Constants";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const theme = localStorage.getItem("theme");
    return theme === "dark" || !theme;
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [workflowDropdownOpen, setWorkflowDropdownOpen] = useState(false);
  const [mobileWorkflowDropdownOpen, setMobileWorkflowDropdownOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleNavbar = () => setMobileDrawerOpen(!mobileDrawerOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleWorkflowDropdown = () => setWorkflowDropdownOpen(!workflowDropdownOpen);

  const handleDropdownClick = () => {
    if (workflowDropdownOpen) setWorkflowDropdownOpen(false);
    if (mobileDrawerOpen) setMobileDrawerOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80 custom">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl tracking-wide font-bold hover:bg-clip-text hover:text-transparent hover:bg-gradient-to-r from-[#6bc83f] to-[#2d511c]">
Digi-Karshakan              </span>
            </Link>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index} className="relative">
                <Link
                  className="flex items-center cursor-pointer hover:text-[#6bc83f]"
                  to={item.href}
                  onClick={(e) => {
                    if (workflowDropdownOpen && item.label === "Workflow") {
                      e.preventDefault();
                    } else {
                      handleDropdownClick();
                    }
                  }}
                >
                  {item.label}
                  {item.label === "Workflow" && (
                    <ChevronDown
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWorkflowDropdown(); 
                      }}
                      className="ml-1"
                    />
                  )}
                </Link>
                
                {workflowDropdownOpen && item.label === "Workflow" && (
                  <ul className="absolute left-0 mt-2 w-56 bg-white dark:bg-neutral-900 dark:opacity-80 shadow-lg rounded-lg text-neutral-900 dark:text-neutral-200">
                    {workflowFeatures.map((menu, index) => (
                      <li key={index}>
                        <Link 
                          to={menu.link} 
                          onClick={handleDropdownClick}
                          className="block px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                        >
                          {menu.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex space-x-6 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:text-[#6bc83f]"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </button>

            <Link to="/workflow"
              onClick = {handleDropdownClick}
              className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 py-2 px-3 mx-2 rounded-md text-white">
              Try Digi-Karshakan
            </Link>
          </div>
          <div className="lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 mr-2 rounded-md hover:text-[#6bc83f]"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun /> : <Moon />}
            </button>
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="text-center fixed right-0 z-20 bg-neutral-200 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 w-full p-12 flex flex-col lg:hidden">
            <ul>
              {navItems.map((item, index) => (
                <li key={index} className="py-4">
                  <Link
                    className="flex items-center justify-center cursor-pointer hover:text-[#6bc83f]"
                    to={item.href}
                    onClick={(e) => {
                      if (mobileWorkflowDropdownOpen && item.label === "Workflow") {
                        e.preventDefault();
                      } else {
                        handleDropdownClick();
                      }
                    }}
                  >
                    {item.label} 
                  </Link>
                </li>
              ))}

              <Link
                to="/workflow"
                onClick={handleDropdownClick}
                className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 py-2 px-3 mx-2 rounded-md text-white"
              >
                Try Digi-Karshakan
              </Link>
            </ul>

          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
