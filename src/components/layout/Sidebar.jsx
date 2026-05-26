import MalkusSimulation from '../widgets/MalkusSimulation';
import profileImg from '../../assets/profile.jpg';
import cvPdf from '../../assets/cv.pdf';

const socialLinks = [
  { name: 'GITHUB', url: 'https://github.com/PSXBRosa' },
  { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/psxbrosa/' }
];

export default function Sidebar() {
  return (
    <aside className="lg:w-1/3 flex flex-col gap-12">
      {/* About Section */}
      <div>
        <h3 className="text-retro-gray text-xs font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
          // ABOUT <div className="flex-grow h-[1px] bg-retro-border"></div>
        </h3>
        <div className="w-full border border-retro-border overflow-hidden mb-4">
          <img src={profileImg} alt="Profile" className="w-full h-auto object-cover transition-all duration-500" />
        </div>
        <p className="text-retro-gray text-xs leading-relaxed mb-4">
          I am a Mechatronics Engineer (Bac+5 @ Poli-USP and CentraleSupélec) focused on control theory, robotics, dynamical systems, and software engineering. My primary expertise lies in real-time autonomous systems, specializing in sensor fusion, state estimation, and embedded software optimization. Welcome to my personal blog ;)
        </p>
        <a 
          href={cvPdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-retro-yellow text-[10px] font-black tracking-widest hover:text-white transition-colors cursor-pointer uppercase underline decoration-2 underline-offset-4"
        >
          VIEW DOSSIER →
        </a>
      </div>

      {/* Chaos Sim Widget */}
      <div className="hidden md:block">
        <h3 className="text-retro-gray text-xs font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
          // Whatever <div className="flex-grow h-[1px] bg-retro-border"></div>
        </h3>
        <MalkusSimulation />
      </div>

      {/* Links Section */}
      <div>
        <h3 className="text-retro-gray text-xs font-black tracking-[0.3em] uppercase mb-6 flex items-center gap-4">
          // CHANNELS <div className="flex-grow h-[1px] bg-retro-border"></div>
        </h3>
        <ul className="flex flex-col gap-2">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="block p-3 text-[10px] font-black border border-retro-border hover:border-retro-blue hover:text-retro-blue transition-all bg-retro-bg/50">
                ✦ &nbsp; {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
