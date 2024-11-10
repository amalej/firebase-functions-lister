import { readFile } from "fs/promises";
import { join, sep as pathSep } from "node:path";

interface FunctionInfo {
  [key: string]: {
    __functionConfigs: {
      availableMemoryMb: any;
      timeoutSeconds: any;
      minInstances: any;
      maxInstances: any;
      ingressSettings: any;
      concurrency: any;
      serviceAccountEmail: any;
      vpc: any;
      platform: any;
      labels: any;
      // There are many other params here
      [key: string]: any;
    };
  };
}

interface CodebaseConfig {
  source: string;
  codebase: string;
  main: string;
  functions: FunctionInfo;
  functionNames: string[];
}

async function importEsmModule(importPath: string): Promise<any> {
  const module = eval(`(async () => {return await import("${importPath}")})()`);
  return module;
}

function getFullPath(relativePath: string) {
  // The "file://" prefix is needed for importing on Windows.
  const pathPrefix = process.platform === "win32" ? "file://" : "";
  const cwd = process.cwd();
  const subPath = join(cwd, relativePath);

  // Hack: This is somewhat needed for Windows
  const fullPath = [pathPrefix, subPath].join(pathSep).replace(/\\/g, "/");
  return fullPath;
}

async function getCodebases(path: string) {
  const codebases: CodebaseConfig[] = [];

  const firebaseJsonPath = join(process.cwd(), path, "firebase.json");
  const firebaseJsonContents = await readFile(firebaseJsonPath, "utf-8");
  const firebaseJson = JSON.parse(firebaseJsonContents);
  const codebaseConfigs = firebaseJson["functions"] as CodebaseConfig[];

  for (let config of codebaseConfigs) {
    const packageJsonPath = join(
      process.cwd(),
      path,
      config.source,
      "package.json"
    );
    const packageJsonContents = await readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContents);
    codebases.push({
      source: config.source,
      codebase: config.codebase,
      main: packageJson.main,
      functions: {},
      functionNames: [],
    });
  }
  return codebases;
}

async function getExports(filePath: string) {
  const fullPath = getFullPath(filePath);
  try {
    const obj = await importEsmModule(fullPath);

    function flattenFunction(obj: any) {
      let finalObject: any = {};
      const keys = Object.keys(obj);
      for (let key of keys) {
        if (key === "default") {
          continue;
        } else if (
          typeof obj[key] === "function" &&
          obj[key]["__endpoint"] !== undefined
        ) {
          finalObject[key] = {
            __functionConfigs: JSON.parse(
              JSON.stringify(obj[key]["__endpoint"])
            ),
          };
        } else if (typeof obj[key] === "object") {
          finalObject[key] = flattenFunction(obj[key]);
        }
      }

      return finalObject;
    }

    function dotObject(obj: any, parentKey: string | null = null) {
      let finalObject: any = {};
      const keys = Object.keys(obj);
      for (let key of keys) {
        if (Object.keys(obj[key]).includes("__functionConfigs")) {
          if (parentKey) {
            finalObject[`${parentKey}.${key}`] = obj[key];
          } else {
            finalObject[`${key}`] = obj[key];
          }
        } else {
          finalObject = { ...finalObject, ...dotObject(obj[key], key) };
        }
      }

      return finalObject;
    }
    return dotObject(flattenFunction(obj));
  } catch (error) {
    console.error("Error reading file or getting exports:", error);
    return {};
  }
}

async function getFuctionsFromCodebase(
  codebase: CodebaseConfig,
  codebasePath: string
) {
  const functions = await getExports(codebasePath);
  codebase.functions = functions;
  codebase.functionNames = Object.keys(functions);
  return codebase;
}

/**
 * Loads the Firebase Functions config.
 * @param functionsPath Relative path to the root directory of the Firebase project folder.
 * @returns List of Firebase Functions codebase config.
 */
export async function loadFunctionsConfig(functionsPath: string) {
  const codebases = await getCodebases(functionsPath);
  const getCodebasePromises: Promise<CodebaseConfig>[] = [];
  for (let codebase of codebases) {
    const modulePath = join(functionsPath, codebase.source, codebase.main);
    getCodebasePromises.push(getFuctionsFromCodebase(codebase, modulePath));
  }

  const codebaseConfigs = await Promise.all(getCodebasePromises);
  return codebaseConfigs;
}
