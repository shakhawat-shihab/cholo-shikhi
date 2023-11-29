import React from "react";
import "./newsLetter.scss";
import { Md13Mp, MdMail } from "react-icons/md";
import { IconButton } from "@material-tailwind/react";

type Props = {};

export default function NewsLetter({}: Props) {
  return (
    <div className="footer-subscriber ">
      <h2>Join Our Newsletter</h2>
      <p>
        Signup to be the first to hear about exclusive deals, special offers and
        upcoming collections
      </p>
      <div className="footer-subscriber-form-container">
        <form>
          <input type="text" placeholder="Enter email for weekly Newsteller" />

          <input type="submit" value="Subscribe" className="hidden sm:block" />
          <div className="bg-black custom-btn flex justify-center items-center  sm:hidden">
            <MdMail className="text-white" size={25} />
          </div>
        </form>
      </div>
    </div>
  );
}
