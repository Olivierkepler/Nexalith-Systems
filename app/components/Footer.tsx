import Link from "next/link";
import { FC } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="w-full border-t border-transparent bg-white/80 backdrop-blur-lg">
      {/* Gradient Border */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          
          {/* Brand Section */}
          <div className="space-y-3">
            {/* <h2 className="text-2xl font-semibold tracking-tight">
              WebAIGen
            </h2> */}
            <img src="/logo1.png" alt="Nexalith Logo" width={120} height={120} />
            <p className="max-w-xs text-sm text-gray-600 leading-relaxed">
              Crafting elegant digital experiences with precision and heart.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
            <div className="space-y-3">
              <h4 className="text-gray-900 font-medium text-sm">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-black transition">About</Link></li>
                <li><Link href="/careers" className="hover:text-black transition">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-black transition">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-black transition">Blog</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-gray-900 font-medium text-sm">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="hover:text-black transition">Docs</Link></li>
                <li><Link href="/faq" className="hover:text-black transition">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-black transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-black transition">Terms</Link></li>
              </ul>
            </div>
          </div>

          {/* Social Section */}
          <div className="flex flex-col items-start justify-between space-y-5 md:items-end">
            <div className="flex space-x-4">
              {/* Social Button */}
              <Link
                href="https://github.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5" />
              </Link>

              <Link
                href="https://linkedin.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
              >
                <Linkedin className="h-5 w-5" />
              </Link>

              <Link
                href="https://twitter.com"
                target="_blank"
                className="p-2 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all duration-300 hover:-translate-y-0.5"
              >
                <Twitter className="h-5 w-5" />
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
