import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto py-12 px-4">
        {/* Footer navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* CV Builder Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CV Builder</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/templates" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/examples" className="text-gray-600 hover:text-blue-600 transition-colors">
                  CV Examples
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Job Search Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Job Search</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/companies" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Companies
                </Link>
              </li>
              <li>
                <Link to="/salary" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Salary Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/career-tips" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Career Tips
                </Link>
              </li>
              <li>
                <Link to="/interview-prep" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Interview Prep
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-gray-200" />

        <div className="relative">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {currentYear} CVNest. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;