import { Link } from "react-router-dom";
import { workflowFeatures, navItems } from "../../Utils/Constants";

const SiteMap = () => {
  return (
    <div className="max-w-7xl mx-auto pt-10 px-6 mt-0 sm:mt-5 md:mt-10 lg:mt-15">

      <div className="mt-6" data-aos="fade-up" data-aos-delay="100">
        <h1 className="text-3xl font-bold">Sitemap</h1>
      </div>

      <div className="text-md text-neutral-500 mt-5" data-aos="fade-up" data-aos-delay="200">
        <Link to="/" className="hover:text-custom-green">Digi-Karshakan</Link>
        <span className="mx-2 text-custom-green"> &#62; </span>
        <Link to="/sitemap" className="text-custom-green">SiteMap</Link>
      </div>

      <div className="mt-8 flex flex-wrap">
        <div className="w-full sm:w-1/2 lg:w-1/2" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">Main Pages</h2>
          <ul className="text-md text-neutral-500 space-y-2">
            {navItems.map((nav, index) => 
                <li key={index}>
                    <div className="text-md">
                        <span className="mx-2 text-custom-green"> &#62; </span>
                        <Link to={nav.href} className="hover:text-custom-green">{nav.label}</Link>
                    </div>
                </li>
            )}
          </ul>
        </div>

        <div className="w-full sm:w-1/2 lg:w-1/2 mt-10 sm:mt-10 md:mt-5 lg:mt-0" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">Workflow</h2>
          <ul className="text-md text-neutral-500 space-y-2">
            {workflowFeatures.map((feature, index) => 
                <li>
                    <div className="text-md">
                        <span className="mx-2 text-custom-green"> &#62; </span>
                        <Link to={feature.link} className="hover:text-custom-green">{feature.text}</Link>
                    </div>
                </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SiteMap;
