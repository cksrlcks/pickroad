import Link from "next/link";

const MENU_ITEMS = [
  {
    id: 1,
    name: "로드카드 만들기",
    href: "/roadmap/create",
  },
  {
    id: 2,
    name: "검색",
    href: "/search",
  },
];

export default function Nav() {
  return (
    <nav>
      <ul className="flex items-center gap-5 text-sm font-medium">
        {MENU_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className="opacity-60 transition-opacity hover:opacity-100"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
