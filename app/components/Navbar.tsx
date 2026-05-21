import { Tooltip } from "./Tooltip";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 mx-auto max-w-400 bg-white flex items-center justify-between border-b-white dark:border-b-white/10 dark:bg-black shadow-sm dark:shadow-gray-800">
      <div className="flex items-center justify-around space-x-4 px-4 py-2 ">
        <Tooltip text="go to home">
          <Link href="/">
            <h1 className="text-3xl text-[#475569] dark:text-[#f8fafc] font-bold box cursor-pointer">
              Les Talk
            </h1>
          </Link>
        </Tooltip>
        <Tooltip text="search">
          <input
            type="text"
            placeholder="search... ?"
            className=" bg-white/30 dark:bg-black/10 border-gray-200 shadow-sm dark:shadow-gray-800 focus:ring-2 rounded-2xl content-evenly max-w-2xs py-2 px-4 focus:outline-none focus:ring-gray-500 transition duration-300 "
          />
        </Tooltip>
      </div>
      <div>
        <ul className="flex space-x-4 px-4 py-2">
          <Tooltip text="go to home">
            <li>
              <Link
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
              >
                Home
              </Link>
            </li>
          </Tooltip>
          <Tooltip text="go to blog">
            <li>
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
              >
                Blog
              </Link>
            </li>
          </Tooltip>
          <Tooltip text="create post">
            <li>
              <Link
                href="/create"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition duration-300"
              >
                Create
              </Link>
            </li>
          </Tooltip>
        </ul>
      </div>
      <div className="flex space-x-4 px-4 py-2">
        <Tooltip text="Login">
          <Link href="/login" className="btn-primary inline-block">
            Login
          </Link>
        </Tooltip>
        <Tooltip text="Sign Up">
          <Link href="/signup" className="btn-secondary inline-block">
            Sign Up
          </Link>
        </Tooltip>
      </div>
    </nav>
  );
}
