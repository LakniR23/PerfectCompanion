import Link from "next/link";
import SubscribeForm from "@/components/common/SubscribeForm";

const footerLinks = {
  Adopt: [
    { label: "Browse Dogs", href: "/dogs" },
    { label: "Browse Cats", href: "/cats" },
    { label: "Browse Birds", href: "/birds" },
    { label: "Browse Rabbits", href: "/rabbits" },
    { label: "Small Animals", href: "/small-animals" },
  ],
  Resources: [
    { label: "Adoption Guide", href: "/guide" },
    { label: "Pet Care Tips", href: "/care" },
    { label: "Training Resources", href: "/training" },
    { label: "Vet Directory", href: "/vets" },
    { label: "Blog", href: "/blog" },
  ],
  Organization: [
    { label: "About Us", href: "/about" },
    { label: "Partner Shelters", href: "/shelters" },
    { label: "Volunteer", href: "/volunteer" },
    { label: "Donate", href: "/donate" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#2B1B22] text-white">

      {/* Newsletter */}
      <div className="bg-[#FF5C8A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-white/80 mb-1">
              Stay updated
            </p>
            <h3 className="text-xl font-bold">
              Get alerts when a new pet is listed
            </h3>
          </div>

          <SubscribeForm variant="footer" />
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs uppercase tracking-[0.15em] text-[#FF8FA3] mb-4">
                {heading}
              </h4>

              <ul className="space-y-2">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#B58A96] hover:text-white transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row justify-between text-xs text-[#8A6672]">
          <p>© {new Date().getFullYear()} Perfect Companion</p>

          <div className="flex gap-5 mt-2 sm:mt-0">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/accessibility">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}