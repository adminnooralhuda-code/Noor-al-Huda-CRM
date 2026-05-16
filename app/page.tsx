// src/app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      
      {/* HEADER SECTION */}
      <header className="bg-white p-4 md:p-5 flex justify-between items-center shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          {/* LOGO PLACEHOLDER: You can replace this <img> tag with your real logo later */}
          <div className="relative w-10 h-10 md:w-12 md:h-12 bg-white-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            <img src="/logo.png" alt="Noor al Huda Logo" />
          </div>
          <span className="font-bold text-base md:text-xl text-gray-900 tracking-tight max-w-[180px] md:max-w-none leading-tight">
            Noor al Huda Typing & Photocopying Services L.L.C
          </span>
        </div>
        <Link 
          href="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm md:text-base px-4 py-2 md:px-6 md:py-2 rounded-lg transition shadow-sm whitespace-nowrap"
        >
          Login Portal
        </Link>
      </header>

      {/* HERO & ABOUT SECTION */}
      <main className="flex-grow flex flex-col items-start justify-center p-6 md:p-12 max-w-4xl mx-auto w-full">
        <span className="text-blue-600 font-semibold tracking-wide uppercase text-xs md:text-sm bg-blue-50 px-3 py-1 rounded-full mb-4">
          CRM Portal
        </span>
        
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight text-left">
          Welcome to Noor al Huda Customer Relationship Management
        </h1>
        
        {/* Left aligned descriptive sentence */}
        <p className="mt-6 text-base md:text-lg text-gray-600 leading-relaxed text-left max-w-2xl">
          Streamline your corporate operations with ease. Our comprehensive platform allows you to 
          efficiently manage company profiles, track employee visa and passport expiries, 
          and stay updated with real-time automated alerts and notifications.
        </p>
        
        <div className="mt-8 w-full sm:w-auto">
          <Link 
            href="/login" 
            className="block sm:inline-block text-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-lg transition shadow-md"
          >
            Explore Services
          </Link>
        </div>
      </main>

      {/* FOOTER SECTION (Contact & Address) */}
      <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact details */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-lg tracking-wide border-l-4 border-blue-600 pl-2">
              Contact Details
            </h3>
            <p className="text-gray-600 flex items-center text-sm md:text-base">
              <span className="font-medium text-gray-800 mr-2">Phone:</span> +971 50 XXXXXXX
            </p>
            <p className="text-gray-600 flex items-center text-sm md:text-base">
              <span className="font-medium text-gray-800 mr-2">Email:</span> info@businesscenter.com
            </p>
          </div>
          
          {/* Address details */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 text-lg tracking-wide border-l-4 border-blue-600 pl-2">
              Our Office Address
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Office No: 102, Building Name,<br />
              Main Street, Near Metro Station,<br />
              Dubai, United Arab Emirates
            </p>
          </div>

        </div>
        <div className="text-center text-xs md:text-sm text-gray-400 mt-8 pt-5 border-t border-gray-100">
          &copy; {new Date().getFullYear()} Noor al Huda CRM. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}