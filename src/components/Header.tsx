import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row">
        <div className="px-2 font-bold">
          <Link to="/">Home</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/feed">Feed</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/profile">Profile</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/profile/dashboard">Dashboard</Link>
        </div>

        <div className="px-2 font-bold">
          <Link to="/profile/add">Add new post</Link>
        </div>
      </nav>
    </header>
  )
}
