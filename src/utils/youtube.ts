export const getYoutubeThumbnail = (url: string): string => {
  const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : 'https://via.placeholder.com/150';
};