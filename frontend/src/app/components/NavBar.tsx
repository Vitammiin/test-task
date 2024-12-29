import Link from 'next/link';

const NavItem = ({ href, label, afterColor, textColor, isLast }) => (
  <li
    className={`relative flex items-center ${
      afterColor && !isLast
        ? "after:content-[''] after:h-[34px] after:w-[1.5px] after:absolute after:right-0 after:top-1/2 after:translate-y-[-50%] after:bg-[var(--after-color)]"
        : ''
    }`}
    style={
      afterColor
        ? ({ '--after-color': afterColor } as React.CSSProperties)
        : undefined
    }
  >
    <Link
      href={href}
      className={`w-full text-center px-[30px] py-[9px] font-semibold ${textColor}`}
    >
      {label}
    </Link>
  </li>
);

export default function NavBar() {
  const navItems = [
    {
      href: '/',
      label: 'audio',
      afterColor: '#c65dc2',
      textColor: 'text-pink-400',
    },
    {
      href: '/form',
      label: 'form',
      afterColor: '#68aad9',
      textColor: 'text-white',
    },
    {
      href: '/stock',
      label: 'stock',
      afterColor: null,
      textColor: 'text-white',
    },
  ];

  return (
    <div className="flex justify-center items-center absolute top-[85px] left-1/2 transform -translate-x-1/2">
      <nav className="p-[1.5px] rounded-[10px] bg-gradient-to-r from-[#FF1CF7] to-[#00F0FF]">
        <ul className="grid grid-cols-3 bg-black rounded-[10px]">
          {navItems.map((item, index) => (
            <NavItem
              key={item.href}
              {...item}
              isLast={index === navItems.length - 1}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}
