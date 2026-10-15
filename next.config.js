module.exports = {
  // Vercel packages native Next.js functions; Docker uses standalone output.
  ...(process.env.VERCEL === '1' ? {} : {output: 'standalone'}),
  outputFileTracingIncludes: {
    // Captured pages are read dynamically by the optional catch-all route.
    '/\\[\\[\\.\\.\\.slug\\]\\]': ['./reference/pages/*.json'],
  },
  async headers() {
    return ['/out', '/api/:path*', '/specification.html', '/scores'].map(source => ({
      source,
      headers: [{key: 'X-Robots-Tag', value: 'noindex, follow'}],
    }));
  },
};
