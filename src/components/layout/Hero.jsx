import heroImg from '../../assets/hero.jpg'

export default function Hero() {
  return (
    <section className="bg-retro-bg text-white border-b border-retro-border flex flex-col md:flex-row">
      <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-retro-border">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-6">THEN<br/>NOW<span className="text-retro-pink animate-pulse">_</span></h2>
          <p className="text-retro-gray text-xs">WELCOME TO MY DIGITAL JOURNAL</p>
        </div>
      </div>
      <div className="h-64 md:h-auto md:w-2/3 bg-cover bg-center" style={{ backgroundImage: `url(${heroImg})` }} />
    </section>
  );
}
