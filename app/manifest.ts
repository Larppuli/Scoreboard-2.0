import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Poikainscore 2.0',
    short_name: 'Poikainscore 2.0',
    theme_color: '#08141c',
    background_color: '#101c24',
    display: 'standalone',
    orientation: 'portrait',
    scope: '/',
    start_url: '/profile',
    icons: [
      {
        src: '/poikainscoreFavicon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  };
}
