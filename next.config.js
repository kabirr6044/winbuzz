module.exports = {
  output: 'standalone',
  async headers() {
    return ['/out', '/api/:path*', '/specification.html', '/scores'].map(source => ({
      source,
      headers: [{key: 'X-Robots-Tag', value: 'noindex, follow'}],
    }));
  },
};
