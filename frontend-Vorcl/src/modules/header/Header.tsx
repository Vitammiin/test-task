import NavBar from './components/NavBar';

export default function Header() {
  return (
    <header className="flex justify-center items-center absolute top-[85px] left-1/2 transform -translate-x-1/2">
      <NavBar />
    </header>
  );
}
