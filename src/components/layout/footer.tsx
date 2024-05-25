import Link from "next/link"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

import { Icons } from "../ui/icons"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="py-10">
        <div className="px-auto container mx-auto  flex flex-col items-center justify-center gap-4 ">
          <Link href={"/"} className="mr-11">
            <Icons.logo mode="light"></Icons.logo>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <p>Home</p>
            <p>About</p>
            <p>Services</p>
            <p>Get in touch</p>
            <p>FAQs</p>
          </div>
        </div>

        <div className="mt-8 w-full border-t"></div>

        <div className="flex flex-col items-center justify-between gap-8 p-4 text-center md:flex-row">
          <p>&copy; 2024 All Rights Reserved</p>
          <div className="flex items-center">
            <p className="mr-2">Follow Us :</p>
            <FaFacebook size={20} className="mr-2" />
            <FaInstagram size={20} className="mr-2" />
            <FaTwitter size={20} className="mr-2" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <p>Terms & Conditions</p>
            <p>Privacy</p>
            <p>Security</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
