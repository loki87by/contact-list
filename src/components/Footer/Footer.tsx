import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer(): React.ReactElement {
  return (
    <section className="Footer">
      <Link to="https://github.com/loki87by" className="Footer__link">
        Loki87by©
      </Link>
      <time>2022</time>
    </section>
  );
}

export default Footer;
