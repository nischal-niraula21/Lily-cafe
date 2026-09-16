import {
  CalendarDays,
  Home,
  Images,
  LayoutDashboard,
  LogOut,
  MenuSquare,
} from "lucide-react";

import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { SITE } from "../config/site";

const links = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/admin/bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
  {
    to: "/admin/cabins",
    label: "Cabins",
    icon: Home,
  },
  {
    to: "/admin/menu",
    label: "Menu",
    icon: MenuSquare,
  },
  {
    to: "/admin/gallery",
    label: "Gallery",
    icon: Images,
  },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0908] text-stone-100 lg:flex">

      {/* SIDEBAR / MOBILE HEADER */}
      <aside className="border-b border-white/10 bg-[#12100e] lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r">

        {/* BRAND */}
        <div className="flex items-center justify-between gap-4 px-6 py-6">

          <div className="flex items-center gap-3">
            <img
              src={SITE.logo}
              className="h-12 w-12 rounded-full object-cover"
              alt="Lily"
            />

            <div>
              <div className="font-serif text-2xl">
                Lily Admin
              </div>

              <div className="text-xs uppercase tracking-[.22em] text-stone-500">
                Cafe &amp; Restaurant
              </div>
            </div>
          </div>

          {/* MOBILE / TABLET LOGOUT */}
          <button
            type="button"
            onClick={signOut}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-stone-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 lg:hidden"
            aria-label="Sign out"
          >
            <LogOut size={17} />

            <span className="hidden sm:inline">
              Sign out
            </span>
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:space-y-1 lg:overflow-visible">
          {links.map(
            ({
              to,
              label,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={Boolean(end)}
                className={({ isActive }) =>
                  `flex min-w-max items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${isActive
                    ? "bg-[#d9ad5f] text-black"
                    : "text-stone-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />

                {label}
              </NavLink>
            )
          )}
        </nav>

        {/* DESKTOP ACCOUNT / LOGOUT */}
        <div className="hidden px-5 lg:absolute lg:bottom-6 lg:left-0 lg:right-0 lg:block">

          <div className="mb-3 rounded-xl border border-white/10 p-3 text-xs text-stone-400">
            <div className="mb-1 text-stone-200">
              {admin?.email || "Admin"}
            </div>

            Lily Cafe Admin Console
          </div>

          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-stone-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={17} />

            Sign out
          </button>
        </div>
      </aside>

      {/* ADMIN CONTENT */}
      <main className="min-w-0 flex-1 lg:ml-72">
        <div className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}