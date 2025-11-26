import Link from "next/link";
import { FC } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="w-full border-t border-transparent bg-white/80 backdrop-blur-lg dark:bg-black/80">
      {/* Gradient Border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 md:grid-cols-3">
          
          {/* Brand Section */}
          <div className="space-y-3">
            {/* <h2 className="text-2xl font-semibold tracking-tight">
              WebAIGen
            </h2> */}
            <img src="/logo1.png" alt="Nexalith Logo" width={120} height={120} className="h-20 w-20 sm:h-24 sm:w-24 md:h-[120px] md:w-[120px]" />
            <p className="max-w-xs text-xs sm:text-sm text-gray-600 leading-relaxed">
              Crafting elegant digital experiences with precision and heart.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 text-sm text-gray-600">
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-gray-900 font-medium text-xs sm:text-sm">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><Link href="/about" className="hover:text-black transition text-xs sm:text-sm">About</Link></li>
                <li><Link href="/careers" className="hover:text-black transition text-xs sm:text-sm">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-black transition text-xs sm:text-sm">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-black transition text-xs sm:text-sm">Blog</Link></li>
              </ul>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-gray-900 font-medium text-xs sm:text-sm">Resources</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                <li><Link href="/docs" className="hover:text-black transition text-xs sm:text-sm">Docs</Link></li>
                <li><Link href="/faq" className="hover:text-black transition text-xs sm:text-sm">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-black transition text-xs sm:text-sm">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-black transition text-xs sm:text-sm">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Section */}
          <div className="flex flex-col items-start md:items-end justify-between space-y-4 sm:space-y-5">
            <div className="flex space-x-3 sm:space-x-4">
              {/* Social Button */}
              <Link
                href="https://github.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>

              <Link
                href="https://twitter.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>

            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} YourBrand — All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
