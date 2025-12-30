module.exports = function (api) {
   api.cache(true);

   return {
      presets : [
         ['babel-preset-expo' , {jsxImportSource : "nativewind"}],
         "nativewind/babel",
      ],
      plugins : [
          [
             'module-resolver',
             {
               root : ['./'],
               alias : {
                 "@" : "./src",
                 "@components" : "./src/components",
                 "@features" : "./src/features",
                 "@services" : "./src/services",
                 "@utils" : "./src/utils",
                 "@types" : "./src/types",
                 "@hooks" : "./src/hooks",
                 "@config" : "./src/config",
               },
               extentions : ['.js' , '.jsx' , '.ts' , '.tsx' , '.json'],
             },
          ],
      ],
   }
};

