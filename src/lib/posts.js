// Helper function to extract the metadata (frontmatter) and the body from the .md files
export const parseMD = (rawFile) => {
  const match = rawFile.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { content: rawFile, meta: {} };
  
  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) meta[key.trim()] = rest.join(':').trim();
  });
  
  return { meta, content: match[2].trim() };
};

export const getPosts = () => {
  // 1. Glob all index.md files in subfolders of /posts/
  const markdownFiles = import.meta.glob('../posts/*/index.md', { query: '?raw', import: 'default', eager: true });
  
  // 2. Glob all images in the /posts/ directory to resolve local references
  const assetFiles = import.meta.glob('../posts/**/*.{png,jpg,jpeg,webp,svg,gif}', { eager: true, import: 'default' });

  return Object.entries(markdownFiles).map(([path, raw]) => {
    const { meta, content } = parseMD(raw);
    
    // Extract the folder name (slug) from the path
    // path looks like "../posts/hello-world/index.md"
    const pathParts = path.split('/');
    const slug = pathParts[pathParts.length - 2];
    const folderPath = pathParts.slice(0, -1).join('/');

    // Resolve local image path if it starts with ./
    let imageUrl = meta.image || 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800';
    if (imageUrl.startsWith('./')) {
      const fileName = imageUrl.replace('./', '');
      const fullAssetPath = `${folderPath}/${fileName}`;
      if (assetFiles[fullAssetPath]) {
        imageUrl = assetFiles[fullAssetPath];
      }
    }
    
    // Set retro colors based on tags
    let tagColor = 'text-retro-gray border-retro-gray';
    if (meta.tag === 'NOTES') tagColor = 'text-retro-pink border-retro-pink';
    if (meta.tag === 'ESSAY') tagColor = 'text-retro-teal border-retro-teal';
    if (meta.tag === 'MIXTAPE') tagColor = 'text-orange-400 border-orange-400';

    return {
      id: slug,
      slug,
      title: meta.title || 'UNTITLED SYSTEM FILE',
      tag: meta.tag || 'DATA',
      tagColor,
      date: meta.date || 'UNKNOWN',
      excerpt: meta.excerpt || '',
      image: imageUrl,
      content
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
};
