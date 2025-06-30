import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavMenuHeader({ routes, isHovered = true, isMobile = false }) {
  return (
    <div className="flex items-center gap-6">
      {routes.map((route, idx) => {
        if (route.divider) {
          return <div key={`divider-${idx}`} className="w-px h-6 bg-white/40" />;
        }

        if (route.visible === false) return null;

        const content = (
          <>
            {route.icon}
            {(isHovered || isMobile) && (
              <span className="hidden md:block text-lg font-semibold mt-1">{route.title}</span>
            )}
          </>
        );

        if (route.path) {
          return (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `flex flex-col items-center text-white transition duration-300 hover:scale-105 ${
                  isActive ? '!text-violet-200 scale-105 my-2' : ''
                }`
              }
            >
              {content}
            </NavLink>
          );
        }

        if (route.action) {
          return (
            <button
              key={`action-${idx}`}
              onClick={route.action}
              className="flex flex-col items-center text-white transition duration-300 hover:scale-105"
              type="button"
            >
              {content}
            </button>
          );
        }

        return null;
      })}
    </div>
  );
}
