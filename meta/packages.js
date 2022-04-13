
/** 
 * 包信息
 * @description build 过程通过 package.json 的 main/module/browser字段判断是否进行相应的 format output
 */
export const packages = [
  {
    name: '@mario34/use-hook',
    iifeName: 'UseHook',
    globals: {
      vue: 'Vue',
    }
  }
]