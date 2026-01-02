module.exports = function (api) {
   api.cache(true);
   return {
     presets: [
      ['babel-preset-expo' , {jsxImportSource : 'nativewind'}],
      'nativewind/babel',
   ],
     plugins: [
       [
         'module-resolver',
         {
           root: ['./src'],
           alias: {
             '@': './src',
             '@components': './src/components',
             '@screens': './src/screens',
             '@navigation': './src/navigation',
             '@services': './src/services',
             '@utils': './src/utils',
             '@types': './src/types',
             '@hooks': './src/hooks',
             '@stores': './src/stores',
           },
           extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
         },
       ],
     ],
   };
 };