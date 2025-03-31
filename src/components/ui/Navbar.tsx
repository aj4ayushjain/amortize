import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <header>
      <nav className="bg-white border-b w-full fixed top-0 z-50" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="font-bold text-base sm:text-xl text-gray-900 hover:text-gray-700 transition-colors no-underline">
                Amortization.in
              </Link>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors no-underline decoration-transparent"
              >
                Home
              </Link>
              <Link 
                to="/blog" 
                className="text-sm sm:text-base text-gray-600 hover:text-gray-900 transition-colors no-underline decoration-transparent"
              >
                Blog
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}