import React from "react";

const FooterLink = ({ href, text }) => {
  return (
    <a href={href} className="footer-link">
      {text}
    </a>
  );
};

export default FooterLink;