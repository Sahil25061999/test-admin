import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ item }: any) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(item.href);

  return (
    <li>
      <Link
        href={item.href}
        className={`
          flex items-center gap-3
          px-3 py-2.5 text-sm
          border-l-4 transition-all duration-200
          ${isActive
            ? "border-primary bg-gray-100 text-gray-900 font-medium"
            : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
        `}
      >
        {item.icon && (
          <item.icon
            className={`
              h-5 w-5 transition-colors
              ${isActive
                ? "text-primary"
                : "text-gray-400 group-hover:text-gray-600"
              }
            `}
          />
        )}

        <span className="truncate">{item.route}</span>
      </Link>
    </li>
  );
}
