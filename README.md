﻿# Ume Server 
<h2 align="center">🛠 Technologies and Tools 🛠</h2>
<br>
<!-- https://simpleicons.org/ -->
<span><img src="https://img.shields.io/badge/JavaScript-282C34?logo=javascript&logoColor=F7DF1E" alt="JavaScript logo" title="JavaScript" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/TypeScript-282C34?logo=typescript&logoColor=3178C6" alt="TypeScript logo" title="TypeScript" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/Node.js-282C34?logo=node.js&logoColor=00F200" alt="Node.js logo" title="Node.js" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/Express-282C34?logo=express&logoColor=FFFFFF" alt="Express.js logo" title="Express.js" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/PostgreSQL-282C34?logo=postgresql&logoColor=336791" alt="PostgreSQL logo" title="MongoDB" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/HTML5-282C34?logo=html5&logoColor=E34F26" alt="HTML5 logo" title="HTML5" height="25" /></span>
&nbsp;
<span><img src="https://img.shields.io/badge/CSS3-282C34?logo=css3&logoColor=1572B6" alt="CSS3 logo" title="CSS3" height="25" /></span>
&nbsp;
<br>



<h2 align="center">🛠 Getting Started 🛠</h2>
<br>
Install all recommendation extensions/plugins for Visual Studio Code text editor

To start the development server:

```bash
npm install
npm run dev
npm run test
```


<h2 align="center">🛠Git Conventional🛠</h2>
<br>


The commit contains the following structural elements, to communicate intent to the consumers of your library:

|                  |                  |                  |
| :--------------- | :--------------- | :--------------- |
| ✨ [FEAT]        | 🧑‍💻 [IMPROVE]    | 🚀 [DELOY]       |
| 🩹 [CHORE]       | ♻️ [REFACTORE]  | 🔀 [MERGE]       |
| 🐛 [FIX]         | 🗑 [CLEAN]       | ⏪ [REVERT]      |
| 🤖 [TEST]        | 💬 [TEXT]       | 🔧 [CONFIG]      |
| ➕ [ADD]         | 💡 [COMMENT]    | 🏗 [BUILD]        |
| ➖ [REMOVE]      | 📝 [DOCS]       | 🌱 [INIT]        |
| 🔊 [ADD-LOG]     | 🔒 [SECURITY]   |  🔥 [BREAKING]   |
| 🔇 [REMOVE-LOG]  | 🚚 [RENAME]     |                   |




More information at: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)


<h2 align="center">🛠 Openapi Generator 🛠</h2>

# Installation

There is also an [NPM package wrapper](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) available for different platforms (e.g. Linux, Mac, Windows). (JVM is still required)
Please see the [project's README](https://github.com/openapitools/openapi-generator-cli) there for more information.

Install it globally to get the CLI available on the command line:

```sh
npm install @openapitools/openapi-generator-cli -g
npx penapi-generator-cli version
```

<!-- RELEASE_VERSION -->
To use a specific version of "openapi-generator-cli"

```sh
npx openapi-generator-cli version-manager set 6.4.0
```

Or install it as dev-dependency:

```sh
npm install @openapitools/openapi-generator-cli -D
```
<!-- /RELEASE_VERSION -->
# Getting Started
Generate openapi from swagger.yml:
```sh
openapi-generator-cli generate -g typescript-axios -i swagger.yml -o ./openapi --additional-properties=npmName=ume-openapi-indentity,supportsES6=true,withInterfaces=true,repository.url="https://github.com/ume-software/openapi-indentity.git",repository.type="git" && npm version patch -git-tag-version false --prefix openapi
```
Or run:
```sh
npm run openapi
```
# NPM publish
```sh
./openapi/git_push.sh dotranminhchu ume-software/openapi-indentity "minor update" "github.com"
cd openapi
npm publish --access public
```