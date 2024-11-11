# Firebase Functions Lister [![github](https://img.shields.io/badge/GitHub-repository-blue)](https://github.com/amalej/firebase-functions-lister) [![npm](https://img.shields.io/npm/v/firebase-functions-lister)](https://www.npmjs.com/package/firebase-functions-lister) [![npm](https://img.shields.io/npm/dt/firebase-functions-lister)](https://www.npmjs.com/package/firebase-functions-lister?activeTab=versions)

Staticly lists the Firebase Functions you have in your local Firebase Project

## Pre-requisites:

- Node modules for the function must be installed
- If you're using TypeScript, it must be complied to JavaScript

## How to use

### Getting Firebase Functions config

```js
const { loadFunctionsConfig } = require("./lib");

async function main() {
  // Change "__tests__/firebase-proj" to relative path to your Firebase Project folder
  const functionCodebaseConfig = await loadFunctionsConfig(
    "__tests__/firebase-proj"
  );
  console.log(JSON.stringify(functionCodebaseConfig, null, 2));
}

main();
```

#### Outputs:

```json
[
  {
    "source": "functions",
    "codebase": "default",
    "main": "index.js",
    "functions": {
      "groups.groupedFunctionJs01": {
        "__functionConfigs": {
          "availableMemoryMb": null,
          "timeoutSeconds": null,
          "minInstances": null,
          "maxInstances": null,
          "ingressSettings": null,
          "concurrency": null,
          "serviceAccountEmail": null,
          "vpc": null,
          "platform": "gcfv2",
          "labels": {},
          "httpsTrigger": {}
        }
      },
      "groups.groupedFunctionJs02": {
        "__functionConfigs": {
          "availableMemoryMb": null,
          "timeoutSeconds": null,
          "minInstances": null,
          "maxInstances": null,
          "ingressSettings": null,
          "concurrency": null,
          "serviceAccountEmail": null,
          "vpc": null,
          "platform": "gcfv2",
          "labels": {},
          "httpsTrigger": {}
        }
      },
      "helloWorldJs01": {
        "__functionConfigs": {
          "availableMemoryMb": null,
          "timeoutSeconds": null,
          "minInstances": null,
          "maxInstances": null,
          "ingressSettings": null,
          "concurrency": null,
          "serviceAccountEmail": null,
          "vpc": null,
          "platform": "gcfv2",
          "labels": {},
          "httpsTrigger": {}
        }
      },
      "onDocWrittenJs01": {
        "__functionConfigs": {
          "availableMemoryMb": null,
          "timeoutSeconds": null,
          "minInstances": null,
          "maxInstances": null,
          "ingressSettings": null,
          "concurrency": null,
          "serviceAccountEmail": null,
          "vpc": null,
          "platform": "gcfv2",
          "labels": {},
          "eventTrigger": {
            "eventType": "google.cloud.firestore.document.v1.written",
            "eventFilters": {
              "database": "(default)",
              "namespace": "(default)"
            },
            "eventFilterPathPatterns": {
              "document": "my-collection/{docId}"
            },
            "retry": false
          }
        }
      }
    },
    "functionNames": [
      "groups.groupedFunctionJs01",
      "groups.groupedFunctionJs02",
      "helloWorldJs01",
      "onDocWrittenJs01"
    ]
  },
  ...
]
```

### Getting list of deploy commands

```js
async function main() {
  const functionCodebaseConfig = await loadFunctionsConfig(
    "./__tests__/firebase-proj"
  );

  const deployCommands = getFunctionsDeployCommands(functionCodebaseConfig);
  console.log(deployCommands);
}

main();
```

#### Outputs:

```json
[
  "functions:default:groups.groupedFunctionJs01",
  "functions:default:groups.groupedFunctionJs02",
  "functions:default:helloWorldJs01",
  "functions:default:onDocWrittenJs01",
  "functions:second-codebase:grouped.helloWorldTsGrouped01",
  "functions:second-codebase:helloWorldTs01",
  "functions:second-codebase:helloWorldTs02",
  "functions:third-codebase:groups.groupedHelloWorldJsEs01",
  "functions:third-codebase:groups.groupedHelloWorldJsEs02",
  "functions:third-codebase:helloWorldJsEs01"
]
```
