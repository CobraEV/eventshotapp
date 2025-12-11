"use client";

import { siteConfig } from "@/lib/constants";
import Link from "next/link";
import { initLenis } from "@/lib/lenis";

const FooterNav = () => {
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return; // skip external/internal pages
    e.preventDefault();
    const lenis = initLenis();
    lenis.scrollTo(href, {
      offset: -60, // adjust for sticky header
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3), // easeOutCubic
    });
  };

  return (
    <ul className="space-y-2">
      {siteConfig.navItems.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            onClick={(e) => handleSmoothScroll(e, item.href)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterNav;
