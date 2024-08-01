module.exports = {
  bracketSameLine: true,
  quoteProps: 'consistent',
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: '*.html',
      options: {
        parser: 'angular',
      },
    },
  ],
  plugins: ['prettier-plugin-organize-imports'],
};
