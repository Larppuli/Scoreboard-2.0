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
    start_url: '/',
    icons: [
      {
        src: '/poikainscoreFavicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/poikainscoreFavicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
