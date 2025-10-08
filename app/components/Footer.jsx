export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Nano Banana</h3>
            <p className="mt-4 text-base text-gray-300">AI Image Editor</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Menu</h3>
            <ul role="list" className="mt-4 space-y-4">
              <li><a href="/generator" className="text-base text-gray-300 hover:text-white">Nano Banana Image Editor</a></li>
              <li><a href="/showcase" className="text-base text-gray-300 hover:text-white">Nano Banana Showcase</a></li>
              <li><a href="/pricing" className="text-base text-gray-300 hover:text-white">Nano Banana Pricing</a></li>
              <li><a href="/16-9-image-generator" className="text-base text-gray-300 hover:text-white">Nano Banana 16:9 Image Generator</a></li>
              <li><a href="/transparent" className="text-base text-gray-300 hover:text-white">Nano Banana Transparent</a></li>
              <li><a href="/developers" className="text-base text-gray-300 hover:text-white">Nano Banana API</a></li>
              <li><a href="/faq" className="text-base text-gray-300 hover:text-white">Nano Banana FAQ</a></li>
              <li><a href="/account" className="text-base text-gray-300 hover:text-white">Nano Banana Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
            <ul role="list" className="mt-4 space-y-4">
              <li><a href="/about" className="text-base text-gray-300 hover:text-white">About Nano Banana</a></li>
              <li><a href="/contact" className="text-base text-gray-300 hover:text-white">Contact Nano Banana</a></li>
              <li><a href="/refunds" className="text-base text-gray-300 hover:text-white">Nano Banana Refunds</a></li>
              <li><a href="/terms" className="text-base text-gray-300 hover:text-white">Nano Banana Terms</a></li>
              <li><a href="/privacy" className="text-base text-gray-300 hover:text-white">Nano Banana Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; 2025 Nano Banana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
