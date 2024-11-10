import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="p-10 fixed top-0 left-0 w-full z-50 bg-white bg-opacity-60 backdrop-blur-sm">
      <div className="flex justify-between">
        <Link href="/">
          {/* <Image alt="Logo Image - MagicStocks.ai" src={""} /> */}
        </Link>

        <nav>Navigation</nav>
        <div>Dashboard</div>
      </div>
    </header>
  );
};

export default Header;
