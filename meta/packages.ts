export interface PackageManifest {
  name: string
  external?: string[]
  globals?: Record<string, string>
  iifeName?: string
}

/** 
 * 包信息
 * @description build 过程通过 package.json 的 main/module/browser字段判断是否进行相应的 format output
 */
export const packages: PackageManifest[] = [
  {
    name: 'use-hook',
    iifeName: 'UseHook',
    globals: {
      vue: 'Vue',
    }
  }
]