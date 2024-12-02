import Link from 'next/link';

export default function NavBar() {
  const navItems = [
    {
      href: '/',
      label: 'Features',
      afterColor: '#c65dc2',
      textColor: 'text-customPink-100',
    },
    {
      href: '/form',
      label: 'Form',
      afterColor: '#68aad9',
      textColor: 'text-white',
    },
    {
      href: '/stock',
      label: 'Stock',
      afterColor: null,
      textColor: 'text-white',
    },
  ];

  return (
    <nav className="p-[1.5px] rounded-[10px] bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
      <ul className="grid grid-cols-3 rounded-sm bg-black">
        {navItems.map((item, index, arr) => (
          <li
            key={item.href}
            className={`relative flex items-center ${
              item.afterColor && index !== arr.length - 1
                ? "after:content-[''] after:h-[34px] after:w-[1.5px] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:bg-[var(--after-color)]"
                : ''
            }`}
            style={
              item.afterColor
                ? ({ '--after-color': item.afterColor } as React.CSSProperties)
                : undefined
            }
          >
            <Link
              href={item.href}
              className={`w-full text-center px-[30px] py-[9px] ${item.textColor}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
