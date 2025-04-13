import "./Header.css";
import Nav from "../Nav/Nav";

const links = [
  {
    name: "Explorar",
    path: "/#",
  },
  {
    name: "Info",
    path: "/#",
  },
  {
    name: "Empresa",
    path: "/#",
  },
  {
    name: "Blog",
    path: "/#",
  },
];

const Header = () => `
  <header>
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Pinterest_Logo.svg/2560px-Pinterest_Logo.svg.png" alt="My App Logo" class="logo-img"/>
    ${Nav(links)}
  </header>
`;

export default Header;
