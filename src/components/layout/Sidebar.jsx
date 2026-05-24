import CyberGame from '../widgets/CyberGame';
import profileImg from '../../assets/profile.jpg';

export default function Sidebar() {
  return (
    <aside className="lg:w-1/3 flex flex-col gap-12">
      {/* About Widget */}
      <div>
        <h3 className="text-retro-gray mb-6">// ABOUT</h3>
        {/* Replace the URL below with your own picture, or use a local asset like: import profileImg from '../../assets/profile.jpg' */}
        <img src={profileImg} alt="Profile" className="w-full h-48 object-cover mb-4 grayscale contrast-125 border border-retro-border hover:grayscale-0 transition-all duration-500" />
        <p className="text-retro-gray text-xs leading-relaxed mb-4">Developer & dreamer. Collecting ideas, code, and moments that shape how we build the future.</p>
        <a href="#" className="text-retro-pink text-xs hover:text-white transition-colors">MORE ABOUT ME →</a>
      </div>

      {/* Minigame Widget */}
      <div>
        <h3 className="text-retro-gray mb-6">// MINIGAME</h3>
        <CyberGame />
      </div>

      {/* Links Widget */}
      <div>
        <h3 className="text-retro-gray mb-6">// LINKS</h3>
        <ul className="text-xs border border-retro-border divide-y divide-retro-border">
          {['X / TWITTER', 'GITHUB', 'LINKEDIN'].map((link) => (
            <li key={link}>
              <a href="#" className="block p-3 hover:bg-white/5 hover:text-retro-pink transition-colors">✦ &nbsp; {link}</a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
