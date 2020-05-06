import banner from 'rollup-plugin-banner';
import { terser } from 'rollup-plugin-terser';

const banners = [
  '<%= pkg.name %> v<%= pkg.version %>',
  '<%= pkg.description %>',
  'by <%= pkg.author %>',
]
  .reverse()
  .map(banner);

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'out/hyaloid.js',
      format: 'iife',
      name: 'hyaloid',
      plugins: [...banners],
    },
    {
      file: 'out/hyaloid.min.js',
      format: 'iife',
      name: 'hyaloid',
      plugins: [terser(), ...banners],
    },
  ],
};
