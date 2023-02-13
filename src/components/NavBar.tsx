import React from "react";
import { ConnectWallet } from "@thirdweb-dev/react";

import gelato from "../assets/images/gelato.png";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a href="/" className="btn btn-ghost normal-case text-xl">
          <img
            className="object-scale-down h-12 w-12"
            src={gelato}
            alt="Gelato"
          />
        </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.gelato.network/developer-services/relay"
            >
              Docs
            </a>
          </li>
          <li className="z-10" tabIndex={0}>
            <a href="/">
              Contact Us
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a
                  href="https://discord.gg/ApbA39BKyJ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/gelatonetwork"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </li>
          <li>
            <ConnectWallet accentColor="#6519e6" colorMode="dark" />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
