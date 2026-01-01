module.exports = function (api) {
   api.cache(true);

   return {
      presets : ['babel-preset-expo'],
      plugins : [
         "nativewind/babel",
          [
             'module-resolver',
             {
               root : ['./'],
               alias : {
                 "@" : "./src",
                 "@components" : "./src/components",
                 "@screens" : "./src/screens",
                 "@navigation" : "./src/navigation",
                 "@features" : "./src/features",
                 "@services" : "./src/services",
                 "@utils" : "./src/utils",
                 "@types" : "./src/types",
                 "@hooks" : "./src/hooks",
                 "@config" : "./src/config",
                 "@stores" : "./src/stores",
               },
               extentions : ['.js' , '.jsx' , '.ts' , '.tsx' , '.json'],
             },
          ],
      ],
   }
};

