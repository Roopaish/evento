import Link from "next/link"
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

import { Button } from "./ui/button"
import { Icons } from "./ui/icons"

export default function Footer() {
  return (
    <footer>
      <div className="bg-blue-900 py-5 text-white">
        <div>
          <div className="px-auto container mx-auto  flex flex-col items-center justify-center gap-4 ">
            <Link href={"/"} className="mr-11">
              <Icons.logo mode="dark"></Icons.logo>
            </Link>
            <div className="mb-4 flex">
              <input
                className="mr-4 rounded-md bg-slate-200 p-2 text-black focus:outline-none"
                placeholder="Enter Your Email"
              ></input>
              <Button>Subscribe</Button>
            </div>
            <div className="flex gap-8 md:mb-0">
              <p>Home</p>
              <p>About</p>
              <p>Services</p>
              <p>Get in touch</p>
              <p>FAQs</p>
            </div>
          </div>
          <div className="mt-4 w-full border-t pt-4 "></div>
          <div className=" m-4 flex justify-between gap-8 p-4">
            <p>&copy; 2024 All Rights Reserved</p>
            <div className="flex items-center">
              <p className="mr-2 font-bold">Follow Us :</p>
              <FaFacebook size={20} className="mr-2" />
              <FaInstagram size={20} className="mr-2" />
              <FaTwitter size={20} className="mr-2" />
            </div>
            <div className="flex gap-8 md:mb-0">
              <p>Terms & Conditions</p>
              <p>Privacy</p>
              <p>Security</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
