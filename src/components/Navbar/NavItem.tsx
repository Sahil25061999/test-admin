import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({ item }) {
  const pathname = usePathname();
  const activeNavStyle = pathname.includes(item.href) ? "  bg-stone-100" : "";
  const icon = item.icon ? (
    <item.icon className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
  ) : null;

  return (
    <li>
      <Link
        href={item.href}
        className={`flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 group ${activeNavStyle}`}
      >
        {icon}
        <span className="ms-3">{item.route}</span>
      </Link>
    </li>
  );
}
