import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/forecast", label: "Forecast" },
  { to: "/safety", label: "Safety" },
  { to: "/profile", label: "Profile" },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-blue-900 bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-700 text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide">Cyclone Dashboard</h1>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-1.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-blue-100 hover:bg-blue-600 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
