import { Monitor } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Monitor className="h-8 w-8 text-blue-400" />
            <span className="font-bold text-xl text-white">TechClub</span>
          </div>
          <div className="text-center">
            <p>
              &copy; 2025 College IT Club. Building the future, one line of code
              at a time.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
