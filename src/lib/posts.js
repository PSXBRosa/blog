// Helper function to extract the metadata (frontmatter) and the body from the .md files
export const parseMD = (rawFile) => {
  const match = rawFile.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { content: rawFile, meta: {} };
  
  const meta = {};
  match[1].split("\n").forEach(line => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length) meta[key.trim()] = rest.join(":").trim();
  });
  
  return { meta, content: match[2].trim() };
};

export const getPosts = () => {
  // 1. Glob all index.md files in subfolders of /posts/
  const markdownFiles = import.meta.glob("../posts/*/index.md", { query: "?raw", import: "default", eager: true });
  
  // 2. Glob all images in the /posts/ directory to resolve local references
  const assetFiles = import.meta.glob("../posts/**/*.{png,jpg,jpeg,webp,svg,gif}", { eager: true, import: "default" });

  return Object.entries(markdownFiles).map(([path, raw]) => {
    const { meta, content } = parseMD(raw);
    
    // Extract the folder name from the path as a fallback slug
    const pathParts = path.split("/");
    const folderSlug = pathParts[pathParts.length - 2];
    const folderPath = pathParts.slice(0, -1).join("/");

    // Prioritize slug from frontmatter, otherwise use folder name
    const slug = meta.slug || folderSlug;

    // Helper to resolve asset paths
    const resolveAsset = (fileName) => {
      const fullAssetPath = `${folderPath}/${fileName.replace(/^\.\//, "")}`;
      return assetFiles[fullAssetPath] || fileName;
    };

    // Resolve local image path if it starts with ./
    let imageUrl = meta.image || "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800";
    if (imageUrl.startsWith("./")) {
      imageUrl = resolveAsset(imageUrl);
    }

    // Process content to resolve relative paths and $ASSETS variable
    let resolvedContent = content;
    
    // 1. Resolve markdown images: ![alt](./image.jpg)
    resolvedContent = resolvedContent.replace(/!\[([^\]]*)\]\(\.\/([^)]+)\)/g, (match, alt, fileName) => {
      return `![${alt}](${resolveAsset(fileName)})`;
    });

    // 2. Resolve HTML src: src="./image.jpg" or src="$ASSETS/image.jpg"
    resolvedContent = resolvedContent.replace(/(src=["\x27])([^\x22\x27]+)(["\x27])/g, (match, prefix, path, suffix) => {
      if (path.startsWith("./")) {
        return `${prefix}${resolveAsset(path)}${suffix}`;
      }
      if (path.startsWith("\x24ASSETS/")) {
        return `${prefix}${resolveAsset(path.replace("\x24ASSETS/", ""))}${suffix}`;
      }
      return match;
    });

    // 3. Resolve standalone $ASSETS/ references
    resolvedContent = resolvedContent.replace(/\x24ASSETS\/([^ \n"\x27>)]+)/g, (match, fileName) => {
      return resolveAsset(fileName);
    });
    
    // Set colors 
    let tagColor = "text-retro-gray border-retro-gray";

    return {
      id: slug,
      slug,
      title: meta.title || "UNTITLED SYSTEM FILE",
      tag: meta.tag || "DATA",
      tagColor,
      date: meta.date || "UNKNOWN",
      excerpt: meta.excerpt || "",
      image: imageUrl,
      content: resolvedContent
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
};
