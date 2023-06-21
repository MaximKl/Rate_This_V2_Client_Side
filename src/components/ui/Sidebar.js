import Link from "./Link";

function Sidebar() {
  const links = [
    { label: "Dropdown", path: "/" },
    { label: "Accordion", path: "/accordion" },
    { label: "Buttons", path: "/buttons" },
    { label: "Modal", path: "/modal" },
    { label: "Table", path: "/table" },
    { label: "Conter", path: "/counter" },
    { label: "Conter with Immer", path: "/counter-immer" },
  ];

  const renderedLinks = links.map((link) => {
    return (
      <Link
        activeClassName="font-bold border-l-4 border-blue-500 pl-2"
        to={link.path}
        key={link.label}
        className="mb-4"
      >
        {link.label}
      </Link>
    );
  });
  return (
    <div className="sticky top-0 overflow-y-scroll flex flex-col items-start">
      {renderedLinks}
    </div>
  );
}

export default Sidebar;
