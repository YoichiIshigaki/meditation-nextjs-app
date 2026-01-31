"use client";

interface HeaderProps {
  toggleSidebar?: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  return (
    <div className="flex justify-between items-center py-4 px-5 bg-white/80">
      <div className="flex items-center">
        {/* Hamburger menu for mobile */}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden mr-2 p-1 text-gray-600 hover:text-gray-800"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-[#7273d0] mr-2.5 flex justify-center items-center text-white">
          J
        </div>
        <div>
          <div>やあjohnさん</div>
          <div className="text-sm text-gray-500">ムードチェック ∨</div>
        </div>
      </div>
    </div>
  );
}
