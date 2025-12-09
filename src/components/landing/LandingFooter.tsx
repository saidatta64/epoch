export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 py-12 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Product</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <a href="#features" className="hover:text-gray-900 transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#cta" className="hover:text-gray-900 transition">
                  Get Started
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Company</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-gray-900">Legal</h3>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-900 transition">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-600">
          <p>&copy; 2025 Epoch ChessLabs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
