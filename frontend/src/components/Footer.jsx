
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t py-6 border-neutral-700">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 px-4 md:px-10">
        <div className="col-span-7 md:col-span-3 flex flex-col justify-start">
          <div className="flex items-center flex-shrink-0">
            {/* <img className="h-10 w-10 mr-2" src={} alt="Logo" /> */}
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:bg-gradient-to-r hover:from-[#2d511c] hover:to-[#6bc83f]">
              Digi-Karshakan
            </span>
          </div>
          <div className="text-md text-neutral-500 mt-2">Digi-Karshakan@gmail.com</div>
        </div>

        <div className="col-span-7 md:col-span-2 flex flex-col justify-start">
          <Link to="/sitemap" className="text-md text-neutral-500 mb-2 hover:text-custom-green" >Sitemap</Link>
        </div>

        <div className="col-span-7 md:col-span-2 flex flex-col justify-start">
          <Link to="/" className="text-md text-neutral-500 mb-2 hover:text-custom-green" >Home</Link>
          <Link to="/features" className="text-md text-neutral-500 mb-2 hover:text-custom-green" >Features</Link>
          <Link to="/workflow" className="text-md text-neutral-500 mb-2 hover:text-custom-green" >Workflow</Link>
          <Link to="/contact" className="text-md text-neutral-500 mb-2 hover:text-custom-green" >Contact</Link>
        </div>

        <div className="col-span-7 text-md text-neutral-500 text-center mt-10 md:mt-0">
          &copy; {new Date().getFullYear()} Digi-Karshakan. All Rights Reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
