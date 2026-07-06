"use client"

export default function Footer() {
  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Newsletter */}
          <div className="lg:col-span-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M21 5.5L12 13.5L3 5.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 3H3c-2 0-3 1-3 3v12c0 2 1 3 3 3h18c2 0 3-1 3-3V6c0-2-1-3-3-3Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13.5L3 18" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 13.5l5 4.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-3">Subscribe to Newsletters</h3>
            <p className="text-gray-400 text-sm mb-6">Want to stay up to date? Sign up for our monthly update.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-primary transition-colors text-sm"
              />
              <button type="submit" className="btn btn-pri w-full justify-center py-3 text-sm">
                Subscribe
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4.6 9.4l3.8 3.8L16 5.6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
            <p className="text-gray-500 text-xs mt-3">Don&apos;t worry about spam. We hate it too!</p>
          </div>

          {/* Links */}
          <div className="lg:col-span-3 lg:col-start-7">
            <div className="flex flex-col gap-4">
              <a href="#" className="text-lg text-gray-700 hover:text-white transition-colors no-underline">Home.</a>
              <a href="#career" className="text-lg text-gray-700 hover:text-white transition-colors no-underline">Career. <span className="text-primary text-xs ml-1">We&apos;re hiring</span></a>
              <a href="#tech" className="text-lg text-gray-700 hover:text-white transition-colors no-underline">Technology.</a>
              <a href="#news" className="text-lg text-gray-700 hover:text-white transition-colors no-underline">News & Media.</a>
              <a href="#contact" className="text-lg text-gray-700 hover:text-white transition-colors no-underline" data-popup="contact">Get in touch.</a>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="mb-6">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Main Office</div>
              <p className="text-sm text-gray-700">
                Global Shipping & Logistics GmbH<br />
                Am Sandtorkai 50<br />
                20457 Hamburg<br />
                Germany
              </p>
            </div>
            <div className="mb-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Email</div>
              <a href="mailto:info@globalshipping-logistics.com" className="text-lg text-white hover:text-primary transition-colors no-underline">
                info@globalshipping-logistics.com
              </a>
            </div>
            <div>
              <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Phone</div>
              <a href="tel:+494052036527" className="text-lg text-white hover:text-primary transition-colors no-underline">
                +49 40 52036527
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-16 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div id="legal" className="scroll-mt-24">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Legal notice</div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              Global Shipping &amp; Logistics GmbH · Am Sandtorkai 50, 20457 Hamburg, Germany ·
              Managing directors: as registered · Commercial register: Amtsgericht Hamburg ·
              VAT ID available on request.
            </p>
          </div>
          <div id="privacy" className="scroll-mt-24">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Privacy</div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-md">
              We process contact-form data solely to answer your request (GDPR Art. 6(1)(b)) and
              never sell it. Tracking data from shipments stays between you and your consignee.
              Questions: <a href="mailto:info@globalshipping-logistics.com" className="text-gray-400 hover:text-white transition-colors">info@globalshipping-logistics.com</a>.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-500 text-xs">© 2025, Global Shipping & Logistics. All Rights Reserved.</div>
          <div className="flex items-center gap-6">
            <a href="#legal" className="text-gray-400 text-xs hover:text-white transition-colors no-underline">Legal notice</a>
            <a href="#privacy" className="text-gray-400 text-xs hover:text-white transition-colors no-underline">Privacy policy</a>
            <a href="https://linkedin.com" target="_blank" className="text-gray-400 text-xs hover:text-white transition-colors no-underline">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* CTA Bar */}
      <a href="#contact" className="block border-t border-white/10 overflow-hidden group" data-popup="contact">
        <div className="flex items-center justify-center py-6 gap-4 bg-dark-2 hover:bg-dark transition-colors">
          <span className="text-xl font-semibold text-white">Are you interested? Let&apos;s discuss today!</span>
          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm font-semibold">Say Hi!</span>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M30.44 3.68L3 31.12.88 29l27.44-27.44L30.44 3.68z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M4.5 1.5h26v26h-3V4.5h-23v-3z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </a>
    </footer>
  )
}
