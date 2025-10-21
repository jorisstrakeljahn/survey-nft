<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">


# SURVEY-NFT

<em>Empowering Secure, Transparent, Cost-Free Survey Participation</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/last-commit/jorisstrakeljahn/survey-nft?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/jorisstrakeljahn/survey-nft?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/jorisstrakeljahn/survey-nft?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<!-- Core -->
<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
<img src="https://img.shields.io/badge/Vue.js-4FC08D.svg?style=flat&logo=vuedotjs&logoColor=white" alt="Vue.js">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/Vue%20I18n-2E7D32.svg?style=flat" alt="Vue I18n">
<img src="https://img.shields.io/badge/Sass-CC6699.svg?style=flat&logo=Sass&logoColor=white" alt="Sass">

<!-- Tooling -->
<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
<img src="https://img.shields.io/badge/Prettier-F7B93E.svg?style=flat&logo=Prettier&logoColor=black" alt="Prettier">
<img src="https://img.shields.io/badge/stylelint-263238.svg?style=flat&logo=stylelint&logoColor=white" alt="stylelint">
<img src="https://img.shields.io/badge/Vitest-6E9F18.svg?style=flat&logo=Vitest&logoColor=white" alt="Vitest">

<!-- Web3 -->
<img src="https://img.shields.io/badge/Hardhat-FFDB1A.svg?style=flat" alt="Hardhat">
<img src="https://img.shields.io/badge/Ethers-2535A0.svg?style=flat&logo=Ethers&logoColor=white" alt="Ethers">
<img src="https://img.shields.io/badge/OpenGSN-0A7C86.svg?style=flat" alt="OpenGSN">
<img src="https://img.shields.io/badge/Polygon-8247E5.svg?style=flat&logo=polygon&logoColor=white" alt="Polygon">
<img src="https://img.shields.io/badge/Polygonscan-384182.svg?style=flat" alt="Polygonscan">
<img src="https://img.shields.io/badge/MetaMask-F6851B.svg?style=flat&logo=metamask&logoColor=white" alt="MetaMask">
<img src="https://img.shields.io/badge/IPFS-65C2CB.svg?style=flat&logo=ipfs&logoColor=black" alt="IPFS">

<!-- Build & Env -->
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/esbuild-FFCF00.svg?style=flat&logo=esbuild&logoColor=black" alt="esbuild">
<img src="https://img.shields.io/badge/dotenv-ECD53F.svg?style=flat&logo=dotenv&logoColor=black" alt="dotenv">
</div>
<br>

---

## Table of Contents

- [Overview](#overview)
    - [What is this?](#what-is-this)
    - [Why survey-nft?](#why-survey-nft)
- [Quickstart](#quickstart)
    - [Web Client (Vite + Vue 3)](#web-client-vite--vue-3)
- [Project Index](#project-index)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)

---

## Overview

Empowering secure, transparent, **cost-free** survey participation with non-transferable (soulbound) NFTs and gasless transactions via OpenGSN.

## What is this?

A web app + smart contracts that record verifiable participant points (VPP) as **non-transferable NFTs**. Users confirm once, points appear in their wallet; lecturers can verify quickly. No personal data on-chain.

**Highlights**
- Gasless via OpenGSN (no crypto needed for users)
- Role-secured, non-transferable NFTs (fair & tamper-proof)
- Polygon-ready (Mainnet / Testnet)
- Local GSN UMD bundle (no third-party CDNs)

## Why survey-nft?

This project empowers developers to create decentralized survey ecosystems with secure, role-controlled NFTs and seamless blockchain interactions. The core features include:

- Gasless Transactions: Enable cost-free, relayed interactions for users via OpenGSN.
- Role-secured, Non-Transferable NFTs: Ensure survey points are unique and tamper-proof.
- Smart Contract Deployment: Automate setup across Polygon and Ethereum networks.
- Modern Web Interface: Deliver an intuitive, user-friendly participation experience.
- Multi-Network Support: Deploy and operate across various blockchain environments.

---

## Quickstart

### Web Client (Vite + Vue 3)
```bash
cd packages/web-client
npm i
npm run dev          # start dev server
# Production:
npm run build
npm run preview
# Deploy: upload packages/web-client/dist/ to your static host (FTP)
```

---

### Project Index

<details open>
	<summary><b><code>SURVEY-NFT/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
		<summary><b>__root__</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ __root__</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/README.md'>README.md</a></b></td>
					<td style='padding: 8px;'>- Provides the core functionality for deploying, managing, and interacting with blockchain-based, verifiable surveys using non-transferable NFTs<br>- It enables seamless smart contract setup, gasless transaction support, and a modern web interface, forming the backbone of a decentralized survey ecosystem that ensures secure, transparent, and user-friendly participation.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the core project metadata and dependencies for the survey-nft application, establishing its identity, versioning, and package management setup<br>- Serves as the foundational configuration that supports the development, deployment, and maintenance of the platform, ensuring consistent package management and project structure within the overall architecture.</td>
				</tr>
			</table>
		</blockquote>
	</details>
	<!-- contracts Submodule -->
	<details>
		<summary><b>contracts</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ contracts</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/.env.example'>.env.example</a></b></td>
					<td style='padding: 8px;'>- Defines environment variables for deploying and managing a Polygon-based NFT project with OpenGSN integration<br>- Facilitates configuration of RPC endpoints, deployment credentials, explorer verification, and network-specific parameters<br>- Supports seamless deployment, verification, and operation of the SurveyNFT contract, including paymaster funding and relay setup, ensuring smooth interaction within the blockchain infrastructure.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/hardhat.config.ts'>hardhat.config.ts</a></b></td>
					<td style='padding: 8px;'>- Defines the configuration for the Hardhat development environment, enabling compilation, deployment, and verification of smart contracts across multiple blockchain networks<br>- It manages compiler settings, network connections, and plugin integrations, ensuring a streamlined workflow for building and deploying blockchain applications within the project architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the contract package configuration and dependencies essential for deploying and testing blockchain smart contracts within the project<br>- It facilitates the development environment setup, manages contract-related scripts, and ensures compatibility with tools like Hardhat, TypeChain, and OpenZeppelin, supporting the overall architecture of secure, upgradeable, and standards-compliant smart contract deployment.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/tsconfig.json'>tsconfig.json</a></b></td>
					<td style='padding: 8px;'>- Defines TypeScript compiler options to ensure consistent, strict, and compatible development and testing environments within the project<br>- It facilitates seamless integration of TypeScript, Node.js, and testing frameworks like Mocha and Chai, supporting reliable contract development, deployment, and testing workflows in the overall smart contract architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/CONTRACTS_README.md'>CONTRACTS_README.md</a></b></td>
					<td style='padding: 8px;'>- Defines core smart contracts for Survey NFT platform, including a role-secured, non-transferable ERC-721 token representing VPP points and an OpenGSN v2 Paymaster enabling gasless transactions<br>- Facilitates deployment, management, and funding of on-chain assets and relayed interactions, forming the backbone for a gasless, role-controlled NFT ecosystem on Polygon.</td>
				</tr>
			</table>
			<!-- contracts Submodule -->
			<details>
				<summary><b>contracts</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ contracts.contracts</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/contracts/SurveyPaymaster.sol'>SurveyPaymaster.sol</a></b></td>
							<td style='padding: 8px;'>- Facilitates gasless interactions with the SurveyNFT contract by acting as a Paymaster within the OpenGSN framework<br>- Ensures only authorized functions related to NFT claiming, burning, and role management are relayed, while managing relay hub funds<br>- Integrates role-based access control to maintain security and proper authorization across survey-related operations in the decentralized application architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/contracts/SurveyNFT.sol'>SurveyNFT.sol</a></b></td>
							<td style='padding: 8px;'>- Implements a soulbound ERC721 NFT system for survey participation, allowing users to claim unique tokens per survey with associated points<br>- Supports administrative updates, token burning, and prevents transfers, ensuring tokens remain non-transferable<br>- Facilitates frontend integration with enumerable tokens and dynamic metadata, serving as a core component for survey-based reward tracking within the broader architecture.</td>
						</tr>
					</table>
				</blockquote>
			</details>
			<!-- scripts Submodule -->
			<details>
				<summary><b>scripts</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ contracts.scripts</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/scripts/02_deploy_paymaster.ts'>02_deploy_paymaster.ts</a></b></td>
							<td style='padding: 8px;'>- Deploys the SurveyPaymaster contract within the blockchain architecture, establishing a payment facilitator for gasless transactions<br>- It configures essential parameters, such as relay hub, forwarder, and target addresses, based on environment variables, and funds the relay hub deposit<br>- This setup enables seamless, sponsored interactions with the associated smart contract ecosystem.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/contracts/scripts/01_deploy_nft.ts'>01_deploy_nft.ts</a></b></td>
							<td style='padding: 8px;'>- Deploys the SurveyNFT smart contract with specified parameters, establishing the core NFT functionality within the project architecture<br>- It automates contract deployment on the Polygon network, integrating essential configuration details such as name, symbol, and administrative addresses, thereby enabling secure and standardized creation of survey-based NFTs as part of the overall system.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- web-client Submodule -->
	<details>
		<summary><b>web-client</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ web-client</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.stylelintignore'>.stylelintignore</a></b></td>
					<td style='padding: 8px;'>- Defines style rules to be ignored by Stylelint, ensuring consistent linting across the project’s CSS and SCSS files<br>- It helps maintain a clean, standardized codebase by excluding specific style resets and other non-critical styles from linting checks, thereby streamlining the development workflow within the web-client architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.eslintrc.js'>.eslintrc.js</a></b></td>
					<td style='padding: 8px;'>- Defines ESLint configuration for the web-client project, ensuring code quality, consistency, and adherence to best practices across Vue 3, TypeScript, and internationalization<br>- Supports maintainability and readability within the overall architecture by enforcing coding standards and integrating localization settings, thereby facilitating a robust and scalable front-end development environment.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/vite.config.ts'>vite.config.ts</a></b></td>
					<td style='padding: 8px;'>- Configures the development and build environment for the web client, integrating Vue.js, SVG icon management, environment-specific plugins, and dependency optimizations<br>- It ensures a streamlined development experience, supports code analysis, and prepares the application for efficient production deployment within the overall architecture<br>- This setup facilitates modular, scalable, and maintainable front-end development.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.editorconfig'>.editorconfig</a></b></td>
					<td style='padding: 8px;'>- Defines formatting and editing standards for the web-client project to ensure consistent code style across the codebase<br>- It establishes guidelines for character encoding, indentation, line endings, and whitespace management, contributing to maintainable and uniform development practices within the overall architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.browserslistrc'>.browserslistrc</a></b></td>
					<td style='padding: 8px;'>- Defines browser support parameters to ensure the web client maintains compatibility across modern browsers while excluding outdated or inactive versions<br>- This configuration guides build tools and transpilers to optimize the applications performance and stability, aligning the front-end delivery with the projects overall architecture focused on delivering a consistent user experience across diverse browser environments.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/README.md'>README.md</a></b></td>
					<td style='padding: 8px;'>- Provides the core structure and configuration for a modern web client built with ViteJS, Vue 3, and TypeScript<br>- Facilitates development, testing, and deployment workflows, ensuring a streamlined process for building a responsive, maintainable, and scalable frontend application within the overall project architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/stylelint.config.js'>stylelint.config.js</a></b></td>
					<td style='padding: 8px;'>- Defines stylelint configuration to enforce consistent, high-quality CSS/SCSS coding standards across the web client<br>- It integrates plugins and processors to handle Vue files, applies strict rules for syntax, formatting, and best practices, and ensures maintainability and visual consistency within the overall project architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines project dependencies, scripts, and configurations for the web client of the NFT Lab platform<br>- Facilitates development, testing, building, and deployment workflows, ensuring seamless integration of Vue.js components, blockchain interactions, and styling<br>- Serves as the central setup point that orchestrates the client-side environment within the overall architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/env.d.ts'>env.d.ts</a></b></td>
					<td style='padding: 8px;'>- Defines environment variables for the web client, enabling dynamic configuration of blockchain network parameters, contract addresses, and RPC endpoints<br>- Facilitates seamless integration with different networks and enhances flexibility in deploying and interacting with blockchain features within the web application<br>- Supports type safety and global access to Ethereum-related objects, ensuring consistent environment handling across the codebase.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.eslintignore'>.eslintignore</a></b></td>
					<td style='padding: 8px;'>- Defines files and directories to be ignored by ESLint during code linting, ensuring that build artifacts, configuration scripts, schemas, static assets, and documentation are excluded from static analysis<br>- This setup maintains a clean linting process focused on the core source code within the web-client project, supporting consistent code quality and development efficiency across the codebase.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/tsconfig.json'>tsconfig.json</a></b></td>
					<td style='padding: 8px;'>- Defines TypeScript compiler options to ensure robust, consistent development and build processes within the web client<br>- It facilitates seamless integration of modern JavaScript features, type safety, and module resolution, supporting the overall architecture by enabling efficient development, testing, and deployment of the frontend application.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/index.html'>index.html</a></b></td>
					<td style='padding: 8px;'>- Sets up the web applications entry point by defining the HTML structure, metadata, and resource links for the Survey NFT platform<br>- It initializes the client-side environment, loads essential styles and scripts, and provides the foundation for a responsive, accessible user interface focused on rewarding participation with NFT-based VPP points within the overall architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/vitest.config.ts'>vitest.config.ts</a></b></td>
					<td style='padding: 8px;'>- Configures the development and build environment for the web client, integrating essential plugins for Vue, SVG icons, TypeScript, ESLint, and performance analysis<br>- It manages environment-specific settings, module resolution, CSS preprocessing, and testing configurations, ensuring a streamlined workflow and optimized output within the overall project architecture.</td>
				</tr>
			</table>
			<!-- src Submodule -->
			<details>
				<summary><b>src</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ web-client.src</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/config.ts'>config.ts</a></b></td>
							<td style='padding: 8px;'>- Defines and manages application configuration settings by aggregating environment variables and package information, ensuring consistent access to key parameters across the web client<br>- Facilitates dynamic configuration based on deployment environment, supporting features like versioning, supported blockchain networks, and contract addresses, thereby enabling flexible and maintainable application behavior within the overall architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/App.vue'>App.vue</a></b></td>
							<td style='padding: 8px;'>- Establishes the main user interface and initialization flow for the web application, managing the display of core components such as navigation and content views<br>- Coordinates app startup procedures, including loading blockchain-related data via ERC-721 contract interactions, setting up notifications, and configuring the application environment to ensure a seamless user experience.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/shims-vue.d.ts'>shims-vue.d.ts</a></b></td>
							<td style='padding: 8px;'>- Defines module declarations for Vue components, enabling seamless integration of.vue files within TypeScript<br>- Facilitates type safety and improved developer experience by allowing Vue single-file components to be correctly recognized and used throughout the web-client architecture<br>- Supports consistent, type-checked component usage across the project’s frontend codebase.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/main.ts'>main.ts</a></b></td>
							<td style='padding: 8px;'>- Initialize and configure the web client application by setting up global properties, integrating essential plugins such as routing, state management, internationalization, and notifications<br>- It also establishes error handling and optimizes style loading for performance, serving as the entry point that orchestrates the core setup and rendering of the Vue.js-based user interface within the overall architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/env.d.ts'>env.d.ts</a></b></td>
							<td style='padding: 8px;'>- Defines global TypeScript declarations to enhance type safety and developer experience within the web client<br>- It integrates project-specific enums, configuration, environment variables, and Ethereum provider types into Vue components and the global scope, facilitating seamless access to core app constants, environment settings, and blockchain interactions across the entire codebase.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/lazy-styles.ts'>lazy-styles.ts</a></b></td>
							<td style='padding: 8px;'>- Loads global styles into the web client, ensuring consistent visual design across the application<br>- Integrates the main SCSS stylesheet into the project’s architecture, facilitating centralized style management and enhancing maintainability within the overall codebase<br>- This setup supports a cohesive user interface by applying shared styling across all components and pages.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/validators.ts'>validators.ts</a></b></td>
							<td style='padding: 8px;'>- Defines validation rules for user input within the web-client, ensuring data integrity and consistency across forms<br>- Integrates internationalized error messaging and specialized validators like Ethereum address verification, supporting a seamless and localized user experience<br>- Serves as a centralized validation utility, promoting maintainability and uniform validation logic throughout the applications frontend architecture.</td>
						</tr>
					</table>
					<!-- composables Submodule -->
					<details>
						<summary><b>composables</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.composables</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/use-web3.ts'>use-web3.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates detection and designation of Web3 providers within the browser environment, enabling seamless integration with various Ethereum-compatible wallets<br>- Supports dynamic provider recognition, ensuring the application can interact with user wallets effectively<br>- Serves as a foundational component for establishing Web3 connectivity, contributing to the overall architecture by managing provider state and ensuring compatibility across different wallet implementations.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/use-notifications.ts'>use-notifications.ts</a></b></td>
									<td style='padding: 8px;'>- Provides a centralized notification handling mechanism that listens for global events and displays styled toast messages accordingly<br>- Integrates internationalization and customizable icons to ensure consistent, user-friendly alerts across the web client, enhancing overall user experience and communication within the applications architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/use-form.ts'>use-form.ts</a></b></td>
									<td style='padding: 8px;'>- Provides reusable state management for form interactions within a Vue.js application<br>- Facilitates enabling, disabling, and displaying confirmation dialogs, as well as handling pending states during form submission<br>- Enhances user experience by streamlining form workflows and ensuring consistent behavior across different form components in the web client architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/use-form-validation.ts'>use-form-validation.ts</a></b></td>
									<td style='padding: 8px;'>- Provides a composable for managing form validation within a Vue.js application, integrating Vuelidate to streamline validation logic, error handling, and user feedback<br>- Facilitates consistent validation state management, error messaging, and field interaction control, supporting robust form handling across the web-client architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Consolidates core composable functions that facilitate form management, validation, notifications, Web3 interactions, provider handling, and smart contract integrations within the web client<br>- Serves as a centralized export point, streamlining access to essential utilities that underpin user interactions, blockchain connectivity, and application state management across the frontend architecture.</td>
								</tr>
							</table>
							<!-- contracts Submodule -->
							<details>
								<summary><b>contracts</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.composables.contracts</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/contracts/use-erc721.ts'>use-erc721.ts</a></b></td>
											<td style='padding: 8px;'>- Provides a comprehensive interface for interacting with an ERC721-based SurveyNFT contract, enabling retrieval of token metadata, ownership, and supply details, as well as facilitating token claiming, burning, and role management<br>- Integrates seamlessly with web3 providers to support user authentication, network validation, and contract operations within a decentralized application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/contracts/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Facilitates centralized access to ERC-721 contract composables within the web client, enabling seamless integration and management of NFT-related functionalities across the application<br>- By aggregating contract-specific logic, it supports modular development and promotes consistent interaction patterns with ERC-721 tokens throughout the codebase.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- useProvider Submodule -->
							<details>
								<summary><b>useProvider</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.composables.useProvider</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/useProvider/use-metamask.ts'>use-metamask.ts</a></b></td>
											<td style='padding: 8px;'>- Provides a comprehensive composable for integrating MetaMask within a Vue application, enabling connection management, network switching, transaction signing, and error handling<br>- Facilitates seamless interaction with Ethereum wallets, ensuring robust provider state updates and user experience enhancements across desktop and mobile environments<br>- Serves as a core utility for blockchain operations within the web-client architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/useProvider/use-provider.ts'>use-provider.ts</a></b></td>
											<td style='padding: 8px;'>- Provides a comprehensive composable for managing blockchain providers within a Vue application<br>- Facilitates connection, network switching, transaction handling, and message signing, enabling seamless integration with wallets like MetaMask<br>- Acts as a central interface for interacting with blockchain networks, ensuring consistent provider management and user authentication across the web client.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/composables/useProvider/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Facilitates centralized access to provider-related functionalities within the web-client architecture, enabling seamless integration and management of blockchain interactions<br>- By aggregating provider hooks, it supports consistent handling of user wallet connections and MetaMask interactions, thereby enhancing the modularity and maintainability of the applications blockchain communication layer.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- utils Submodule -->
					<details>
						<summary><b>utils</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.utils</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/utils/date.util.ts'>date.util.ts</a></b></td>
									<td style='padding: 8px;'>- Provides utility functions for date manipulation and formatting within the web client, enabling consistent handling of date representations, conversions between timestamps and ISO formats, and relative time calculations<br>- These utilities support the broader architecture by ensuring uniform date processing across the application, facilitating accurate time-based features and enhancing user experience through reliable date displays.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/utils/chain.util.ts'>chain.util.ts</a></b></td>
									<td style='padding: 8px;'>- Provides utility functions for interacting with blockchain networks, focusing on identifying and verifying the current chain<br>- Facilitates chain ID retrieval, conversion between hexadecimal and decimal formats, and validation against supported networks<br>- Enhances the web client’s ability to adapt dynamically to different blockchain environments, ensuring compatibility and correct network operations within the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/utils/gsn-loader.ts'>gsn-loader.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates the dynamic loading of the Gas Station Network (GSN) and Web3 scripts to ensure seamless integration of blockchain transaction relaying within the web client<br>- It manages script dependencies efficiently, enabling the application to interact with decentralized services without redundant script loads, thereby supporting reliable and optimized blockchain connectivity across the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/utils/math.util.ts'>math.util.ts</a></b></td>
									<td style='padding: 8px;'>- Provides a robust utility for precise arbitrary-precision arithmetic tailored for blockchain applications<br>- Facilitates conversions between units like Wei and tokens, supports various rounding modes, and ensures consistent number formatting<br>- Enhances financial calculations, token handling, and data presentation within the web-client, ensuring accuracy and flexibility across the entire codebase architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/utils/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Consolidates utility functions related to mathematical operations and date handling, facilitating consistent and efficient data processing across the web-client application<br>- Serves as a centralized access point for core utility modules, supporting the overall architecture by promoting code reuse and simplifying integration within various components of the project.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- pages Submodule -->
					<details>
						<summary><b>pages</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.pages</b></code>
							<!-- ConnectPage Submodule -->
							<details>
								<summary><b>ConnectPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.ConnectPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/ConnectPage/ConnectPage.vue'>ConnectPage.vue</a></b></td>
											<td style='padding: 8px;'>- Facilitates user connection to the blockchain network by managing wallet detection, account authorization, and network switching<br>- Ensures users are on the correct chain before proceeding, providing a seamless onboarding experience<br>- Integrates with routing to automatically redirect authenticated users, supporting secure and user-friendly access to blockchain-dependent features within the application.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/ConnectPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Facilitates the integration of the ConnectPage component into the web client by exporting the Vue component, enabling seamless navigation and user interaction within the applications connection flow<br>- Serves as a crucial link in the page routing architecture, ensuring the ConnectPage is properly registered and accessible within the overall web client structure.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- PrivacyPage Submodule -->
							<details>
								<summary><b>PrivacyPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.PrivacyPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/PrivacyPage/PrivacyPage.vue'>PrivacyPage.vue</a></b></td>
											<td style='padding: 8px;'>- Defines a data-driven, accessible Privacy Policy page that dynamically renders content from internationalized JSON structures<br>- It organizes sections with semantic markup, provides a responsive table of contents, and ensures clarity for assistive technologies<br>- The page enhances user experience by combining structured content, navigation, and styling aligned with the overall web application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/PrivacyPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Defines the entry point for the PrivacyPage component within the web client, integrating the privacy-related user interface into the overall application architecture<br>- It facilitates seamless routing and rendering of the privacy information page, ensuring consistent user experience and maintainability across the web applications page structure.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- HomePage Submodule -->
							<details>
								<summary><b>HomePage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.HomePage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/HomePage/HomePage.vue'>HomePage.vue</a></b></td>
											<td style='padding: 8px;'>- Defines the homepage layout, presenting the core value proposition, key benefits, and navigation options for users<br>- It introduces visitors to the platform through engaging sections, including a hero banner, introductory content, feature highlights, and FAQs, guiding users toward main app areas for students and administrators while ensuring accessibility and clarity within the overall web architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/HomePage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Exports the main HomePage component for the web client, serving as the entry point for the applications homepage<br>- It integrates the Vue component into the overall architecture, enabling seamless rendering and navigation within the user interface<br>- This file acts as a bridge, connecting the homepages visual and functional elements to the broader web application structure.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- NftsPage Submodule -->
							<details>
								<summary><b>NftsPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.NftsPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/NftsPage/NftsPage.vue'>NftsPage.vue</a></b></td>
											<td style='padding: 8px;'>- Provides a read-only interface for users to view their owned VPP NFTs, displaying a responsive grid with token images, metadata, and points summary<br>- Facilitates manual refresh, handles loading and error states, and links to external explorers for detailed token information, integrating seamlessly into the overall architecture by presenting user assets efficiently and interactively.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/NftsPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Exports the main NFT page component to serve as the entry point for the NFTs section within the web client<br>- It integrates the Vue component responsible for displaying and managing NFT-related content, facilitating seamless navigation and rendering within the overall application architecture<br>- This file acts as a connector, ensuring the NFTs interface is properly linked and accessible.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- AccessibilityPage Submodule -->
							<details>
								<summary><b>AccessibilityPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.AccessibilityPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AccessibilityPage/AccessibilityPage.vue'>AccessibilityPage.vue</a></b></td>
											<td style='padding: 8px;'>- Provides an accessible overview of the websites accessibility features, including key information, contact details, and navigation aids<br>- It structures content into clearly defined sections to enhance user understanding and navigation, supporting compliance with accessibility standards and improving overall user experience for diverse audiences.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AccessibilityPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Defines the entry point for the Accessibility page within the web client, linking the Vue component to the applications routing system<br>- Facilitates seamless navigation to accessibility features, ensuring users can easily access and utilize accessibility options across the platform<br>- Integrates the visual and functional aspects of the Accessibility page into the overall web architecture.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- AdminPage Submodule -->
							<details>
								<summary><b>AdminPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.AdminPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AdminPage/AdminRoles.vue'>AdminRoles.vue</a></b></td>
											<td style='padding: 8px;'>- The <code>AdminRoles.vue</code> component serves as the user interface for managing user roles within the administrative section of the application<br>- It enables administrators to assign or revoke roles for specific addresses efficiently, providing inline controls for role management<br>- This component integrates with the broader admin architecture to facilitate secure and streamlined permission handling, contributing to the overall security and access control framework of the system.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AdminPage/AdminWallets.vue'>AdminWallets.vue</a></b></td>
											<td style='padding: 8px;'>- Provides an administrative interface for managing user wallets and associated NFTs within the web application<br>- Enables searching for wallets, displaying key metrics, viewing NFT metadata, and executing gasless token burn operations<br>- Integrates with blockchain contracts and explorers to facilitate token management, ensuring efficient oversight and control over NFT assets in the platforms architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AdminPage/AdminLayout.vue'>AdminLayout.vue</a></b></td>
											<td style='padding: 8px;'>- Defines the layout and access control interface for the admin section, managing role-based permissions and navigation visibility based on blockchain-derived privileges<br>- Facilitates user authentication, dynamically updates role status, and renders appropriate admin views, ensuring secure and role-specific management of administrative functionalities within the web application.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AdminPage/AdminGenerator.vue'>AdminGenerator.vue</a></b></td>
											<td style='padding: 8px;'>- Provides an interactive interface for generating customized survey XML files by replacing placeholders with user-specified survey IDs and point values<br>- Facilitates seamless client-side template modification and download, ensuring robust handling of byte-level operations without relying on XML parsing<br>- Integrates into the admin section to streamline survey configuration management within the overall application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/AdminPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Defines the administrative routing structure within the web client, organizing access to core management features such as wallets, roles, and generator tools under a unified admin layout<br>- Facilitates seamless navigation and modular component loading, supporting the overall architectures goal of a scalable, maintainable admin interface for managing application resources and permissions.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- ImprintPage Submodule -->
							<details>
								<summary><b>ImprintPage</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.pages.ImprintPage</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/ImprintPage/ImprintPage.vue'>ImprintPage.vue</a></b></td>
											<td style='padding: 8px;'>- Defines the structure and presentation of the Imprint page, delivering essential legal and contact information in a clear, accessible format<br>- It organizes content into sections with headings, paragraphs, lists, and contact details, ensuring users can easily find and navigate legal disclosures, company info, and contact points within the overall web application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/pages/ImprintPage/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Exports the ImprintPage component to serve as the main content for the Imprint page within the web client<br>- It integrates the Vue component into the applications routing and rendering system, ensuring users can access and view the imprint information seamlessly as part of the overall website architecture.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- store Submodule -->
					<details>
						<summary><b>store</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.store</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/store/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Establishes the central state management system for the web client by creating and exporting a Pinia store instance<br>- Facilitates organized state handling across the application, enabling modular state modules to be integrated seamlessly<br>- Serves as the foundational layer for managing reactive data, ensuring consistent state updates and data flow within the overall architecture.</td>
								</tr>
							</table>
							<!-- modules Submodule -->
							<details>
								<summary><b>modules</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.store.modules</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/store/modules/use-web3-providers.module.ts'>use-web3-providers.module.ts</a></b></td>
											<td style='padding: 8px;'>- Manages Web3 provider detection and initialization within the application, enabling seamless integration with user wallets like MetaMask<br>- Ensures the correct provider is selected and connected, verifies chain compatibility, and maintains provider state to facilitate blockchain interactions across the web client<br>- Supports dynamic provider management aligned with project configuration and user environment.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/store/modules/use-erc721.module.ts'>use-erc721.module.ts</a></b></td>
											<td style='padding: 8px;'>- Defines a Pinia store that manages interactions with a specific ERC-721 contract, enabling seamless access to NFT-related functionalities within the web client<br>- Integrates the ERC-721 composable to facilitate blockchain operations, supporting the overall architecture by providing a centralized, reactive state for NFT management in the frontend application.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/store/modules/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Exports aggregate core Web3-related modules, facilitating seamless integration of Web3 providers and ERC721 functionalities within the web client<br>- This central index streamlines access to blockchain interaction capabilities, supporting the overall architecture by enabling modular, scalable, and maintainable web3 features across the application.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- localization Submodule -->
					<details>
						<summary><b>localization</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.localization</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/resources.ts'>resources.ts</a></b></td>
									<td style='padding: 8px;'>- Defines the structure for localized message resources within the web client, centralizing language-specific content<br>- It facilitates seamless internationalization by organizing language files and providing a unified interface for accessing localized messages across the application, thereby supporting a scalable and maintainable multilingual user experience within the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Defines and initializes multilingual support for the web client by configuring language messages, setting default and fallback locales, and enabling dynamic language switching<br>- Facilitates seamless internationalization across the application, ensuring content is accessible in both English and German, with persistent language preferences stored locally for user convenience.</td>
								</tr>
							</table>
							<!-- resources Submodule -->
							<details>
								<summary><b>resources</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.localization.resources</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/resources/en.json'>en.json</a></b></td>
											<td style='padding: 8px;'>- This file provides localized string resources for the English language, centralizing user-facing validation messages and error notifications within the web client<br>- It ensures consistent and user-friendly communication across the applications interface, supporting the overall architecture by facilitating seamless internationalization and robust error handling<br>- This contributes to a cohesive user experience and simplifies maintenance of message content across the codebase.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- en Submodule -->
							<details>
								<summary><b>en</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.localization.en</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/imprint.json'>imprint.json</a></b></td>
											<td style='padding: 8px;'>- Defines the localized content for the Imprint page within the web client, providing essential legal, contact, and organizational information about Hochschule Bielefeld<br>- This JSON file supports multilingual user interfaces by supplying structured, human-readable data that ensures compliance and transparency, integrating seamlessly into the overall architecture to enhance user experience and legal clarity.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/admin.json'>admin.json</a></b></td>
											<td style='padding: 8px;'>- Provides localization strings for the Admin / Teaching Panel interface, facilitating user interactions related to wallet management, NFT operations, role assignments, and XML generation<br>- Enhances user experience by delivering clear labels, instructions, and feedback within the web client, supporting administrative workflows and role-based access control in the overall application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/header.json'>header.json</a></b></td>
											<td style='padding: 8px;'>- Defines localized header labels for the web client interface, enabling consistent and user-friendly navigation across the application<br>- Supports multilingual functionality by providing key translations for header elements such as start, admin, and view points, ensuring clarity and accessibility within the overall architecture of the user interface.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/meta.json'>meta.json</a></b></td>
											<td style='padding: 8px;'>- Provides localization metadata for the web client interface, enhancing accessibility and user experience by defining labels, tooltips, and fallback texts related to token details and UI interactions<br>- Serves as a centralized resource for consistent language presentation across the application, supporting clear communication and usability within the overall architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/privacy.json'>privacy.json</a></b></td>
											<td style='padding: 8px;'>- Defines the privacy policy content for the web client, outlining data collection practices, user rights, and security measures<br>- Serves as the authoritative source for privacy information displayed within the application, ensuring compliance with GDPR and transparency for users regarding personal data handling<br>- Integrates seamlessly into the localization framework to present privacy details in English.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/home.json'>home.json</a></b></td>
											<td style='padding: 8px;'>- Provides localized content for the homepage, highlighting the benefits and functionality of the Survey NFT system<br>- It communicates key features such as tamper-proof digital points, transparency, and ease of use for students and lecturers<br>- The content supports user understanding and engagement by explaining the systems purpose, benefits, and frequently asked questions within the overall web application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/footer.json'>footer.json</a></b></td>
											<td style='padding: 8px;'>- Defines localized footer content for the web client, providing essential information such as project title, participant points as tamper-proof NFTs, contact details, and legal links<br>- Supports consistent presentation of footer elements across the application, ensuring clarity and accessibility for users engaging with the blockchain-based participant points system within the overall web architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/accessibility.json'>accessibility.json</a></b></td>
											<td style='padding: 8px;'>- Provides the accessibility statement content for the Hochschule Bielefeld web portal, outlining conformance status, known issues, user feedback channels, and compliance details<br>- Serves as a key reference for ensuring transparency and guiding ongoing accessibility improvements across the website, aligning with legal standards and user needs<br>- Supports the broader effort to enhance digital inclusivity within the project architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/nfts.json'>nfts.json</a></b></td>
											<td style='padding: 8px;'>- Provides localized UI text for the NFTs section within the web client, enabling clear and consistent presentation of user points, NFT details, and related actions<br>- Supports user engagement by displaying status messages, summaries, and error notifications, thereby enhancing the overall user experience in managing and viewing NFT-related information in the application.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/connect.json'>connect.json</a></b></td>
											<td style='padding: 8px;'>- Defines localized user interface content for the wallet connection process within the web client<br>- Facilitates clear communication around connecting a wallet, switching networks, and status updates, ensuring a seamless user experience during blockchain interactions<br>- Integrates with the overall architecture by supporting multilingual UI elements and guiding users through wallet setup and connection workflows.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/en/nft.json'>nft.json</a></b></td>
											<td style='padding: 8px;'>- Provides localized string mappings for NFT-related user interface elements within the web client<br>- Facilitates consistent and dynamic display of NFT details, such as navigation prompts, token identifiers, and trait labels, supporting seamless internationalization and user experience across the applications architecture.</td>
										</tr>
									</table>
								</blockquote>
							</details>
							<!-- de Submodule -->
							<details>
								<summary><b>de</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.localization.de</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/imprint.json'>imprint.json</a></b></td>
											<td style='padding: 8px;'>- Defines the localized imprint information for the web application, providing essential legal, contact, and organizational details in German<br>- Serves as a centralized resource to ensure consistent presentation of legal and organizational data across the user interface, supporting compliance and transparency within the overall architecture of the multilingual web client.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/admin.json'>admin.json</a></b></td>
											<td style='padding: 8px;'>- Provides German localization for the admin interface, enabling management of user roles, NFTs, and XML generation within the web client<br>- Facilitates role assignments, NFT listings, and transaction actions, supporting administrative oversight and user interaction in a blockchain-based platform<br>- Enhances user experience by delivering localized content for administrative tasks and system feedback.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/header.json'>header.json</a></b></td>
											<td style='padding: 8px;'>- Defines German localization strings for the header section of the web client interface, enabling language-specific rendering of navigation labels<br>- Supports multilingual user experience by providing localized text for key header elements such as start, admin, and user points, ensuring clarity and accessibility within the overall application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/meta.json'>meta.json</a></b></td>
											<td style='padding: 8px;'>- Provides German localization metadata for token-related UI elements within the web client, enhancing accessibility and user experience<br>- It defines language-specific labels, tooltips, and messages for displaying token attributes, metadata, and interface controls, ensuring consistent and culturally appropriate interactions across the platform<br>- This supports seamless internationalization and improves usability for German-speaking users.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/privacy.json'>privacy.json</a></b></td>
											<td style='padding: 8px;'>- Defines the German privacy policy content for the web client, outlining data protection principles, user rights, and processing practices<br>- It supports the overall architecture by ensuring compliance with GDPR and providing localized legal information, thereby enhancing transparency and trust within the applications internationalized user interface.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/home.json'>home.json</a></b></td>
											<td style='padding: 8px;'>- Provides localized content for the homepage of the Survey NFT platform, highlighting its purpose to facilitate secure, transparent, and cost-free digital recording of participant points in studies<br>- It emphasizes user benefits for students and educators, explaining system features, FAQs, and key information to ensure clarity and accessibility within the overall application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/footer.json'>footer.json</a></b></td>
											<td style='padding: 8px;'>- Defines localized footer content for the web client, providing essential information such as project title, description, contact details, legal links, and accessibility notes<br>- It supports consistent presentation of footer elements across the application, enhancing user experience and ensuring compliance with legal and accessibility standards within the blockchain-based experiment platform.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/accessibility.json'>accessibility.json</a></b></td>
											<td style='padding: 8px;'>- Provides accessibility information for the Hochschule Bielefeld website, detailing compliance status, non-accessible content, feedback channels, enforcement procedures, and creation date<br>- Supports transparency and user awareness regarding web accessibility efforts, aligning with legal standards and fostering inclusive digital experiences across the platform.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/nfts.json'>nfts.json</a></b></td>
											<td style='padding: 8px;'>- Provides localized German language strings for the NFTs section of the web client, enabling user interface elements such as titles, summaries, actions, empty states, error messages, and card details<br>- Supports consistent and user-friendly presentation of NFT-related data, enhancing the overall user experience within the applications architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/connect.json'>connect.json</a></b></td>
											<td style='padding: 8px;'>- Provides German localization content for the wallet connection interface within the web client<br>- It defines user-facing text for connecting a wallet, switching networks, and status updates, supporting seamless user interactions during wallet onboarding and network configuration in the broader blockchain application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/localization/de/nft.json'>nft.json</a></b></td>
											<td style='padding: 8px;'>- Provides German localization strings for the web client, enabling user interface elements related to NFTs to display correctly in German<br>- Supports internationalization by supplying language-specific labels and navigation prompts, ensuring a seamless and culturally appropriate user experience within the broader multilingual architecture of the application.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- config Submodule -->
					<details>
						<summary><b>config</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.config</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/config/addresses.ts'>addresses.ts</a></b></td>
									<td style='padding: 8px;'>- Defines essential blockchain addresses, network parameters, and configuration constants for interacting with the Polygon network within the web client<br>- Facilitates seamless connection to smart contracts, relays, and RPC endpoints, supporting reliable deployment, transaction processing, and data retrieval in the applications architecture.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- router Submodule -->
					<details>
						<summary><b>router</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.router</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/router/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Defines the applications client-side routing architecture, managing navigation between pages, including public, admin, and protected routes<br>- Implements route guards to ensure MetaMask connectivity for blockchain interactions, handles route transitions with smooth scrolling, and facilitates dynamic component loading, thereby supporting seamless user navigation and access control within the web client.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- errors Submodule -->
					<details>
						<summary><b>errors</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.errors</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/errors/runtime.errors.ts'>runtime.errors.ts</a></b></td>
									<td style='padding: 8px;'>- Defines a comprehensive set of runtime error classes to handle various failure scenarios within the web client’s provider interactions<br>- These error classes facilitate consistent error handling and debugging across the codebase, ensuring robust management of provider-related issues during runtime operations.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/errors/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Consolidates various runtime error definitions into a centralized errors object, facilitating consistent error handling across the web client<br>- Enhances maintainability by providing a unified interface for managing runtime errors, supporting robust user experience and streamlined debugging within the overall application architecture.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- helpers Submodule -->
					<details>
						<summary><b>helpers</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.helpers</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/browser.helpers.ts'>browser.helpers.ts</a></b></td>
									<td style='padding: 8px;'>- Provides utility functions to detect mobile operating systems, specifically iOS and Android, within the web client<br>- These helpers facilitate responsive and device-specific behavior by enabling the application to adapt its interface and functionality based on the users device type, supporting a seamless user experience across mobile platforms within the overall web architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/ethereum.helpers.ts'>ethereum.helpers.ts</a></b></td>
									<td style='padding: 8px;'>- Provides utility functions for interacting with Ethereum wallets, primarily MetaMask, within the web client<br>- Facilitates account connection, network switching, chain addition, and error handling, ensuring seamless integration with Ethereum providers<br>- Enhances the overall architecture by abstracting wallet interactions, enabling reliable and user-friendly blockchain operations across the application.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/promise.helpers.ts'>promise.helpers.ts</a></b></td>
									<td style='padding: 8px;'>- Provides a utility function to introduce delays within asynchronous workflows, facilitating controlled timing and synchronization across the web client<br>- Enhances the overall architecture by enabling smoother user interactions and reliable sequencing of operations, contributing to a more responsive and predictable user experience within the applications frontend.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/clipboard.helpers.ts'>clipboard.helpers.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates seamless interaction with the system clipboard by providing functions to copy and read text, enhancing user experience within the web client<br>- These helpers enable efficient data transfer between the application and user’s clipboard, supporting features that require quick copying or pasting of information, thereby integrating core clipboard functionalities into the overall web-based interface architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/event-bus.ts'>event-bus.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates decoupled communication across the web client by providing an event-driven system for broadcasting and listening to notifications and status updates<br>- It centralizes event management, enabling components to trigger and respond to global events such as success, error, warning, and info messages, thereby enhancing modularity and user feedback handling within the applications architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Consolidates core helper functions related to user interactions, error handling, event management, asynchronous operations, Ethereum blockchain integration, and browser utilities<br>- Serves as a centralized export point to streamline access and maintainability across the web-client architecture, facilitating seamless integration of essential utilities within the applications frontend environment.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/helpers/error-handler.ts'>error-handler.ts</a></b></td>
									<td style='padding: 8px;'>- Provides centralized error handling by translating various provider-related errors into user-friendly messages and logging them<br>- Enhances user experience through consistent feedback and maintains robust error tracking within the web client architecture<br>- Ensures that errors are communicated effectively while preserving detailed logs for debugging and support.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- types Submodule -->
					<details>
						<summary><b>types</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.types</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/ethereum.d.ts'>ethereum.d.ts</a></b></td>
									<td style='padding: 8px;'>- Defines a minimal TypeScript interface for interacting with Ethereum providers following the EIP-1193 standard, primarily targeting MetaMask<br>- Facilitates type-safe access to Ethereum wallet functionalities within the web client, ensuring seamless integration and communication between the user’s browser wallet and the application<br>- Supports consistent handling of provider requests and events across the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/global.d.ts'>global.d.ts</a></b></td>
									<td style='padding: 8px;'>- Defines global TypeScript declarations for the web client, extending the Window interface to include optional Web3 and GSN properties<br>- Facilitates seamless integration of blockchain and gas station network functionalities across the application, ensuring type safety and consistent access to these global objects throughout the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/common.types.ts'>common.types.ts</a></b></td>
									<td style='padding: 8px;'>- Defines shared data structures for the web client, facilitating consistent handling of notifications and NFT-related information across the application<br>- These types enable seamless integration of notification messages and NFT details, supporting user interface components and data management within the overall architecture<br>- Ensures type safety and clarity in representing core entities related to user interactions and digital assets.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/ethereum.types.ts'>ethereum.types.ts</a></b></td>
									<td style='padding: 8px;'>- Defines TypeScript types for Ethereum provider interactions within the web client, facilitating seamless integration with external Ethereum providers and handling RPC errors<br>- Supports robust communication with blockchain networks by standardizing provider interfaces and error structures, thereby enhancing the overall architectures reliability and maintainability in the decentralized application ecosystem.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/gsn-global.d.ts'>gsn-global.d.ts</a></b></td>
									<td style='padding: 8px;'>- Defines global TypeScript declarations to extend the Window interface with optional properties related to Web3 and relay provider configurations<br>- Facilitates seamless integration of blockchain connectivity within the web client by enabling type-safe access to these global objects across the codebase<br>- Supports consistent handling of blockchain provider references throughout the application architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/provider.types.ts'>provider.types.ts</a></b></td>
									<td style='padding: 8px;'>- Defines types and interfaces for managing Ethereum providers within the web client, enabling seamless interaction with blockchain networks<br>- Facilitates provider selection, connection, network switching, transaction signing, and account management, forming a core part of the applications blockchain integration layer<br>- Supports robust, type-safe handling of provider-related operations across the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Consolidates and re-exports essential type definitions related to core data structures, provider configurations, Ethereum interactions, and smart contract interfaces<br>- Facilitates streamlined access to shared type information across the web client, supporting consistent data handling and integration within the overall architecture<br>- Enhances maintainability and type safety throughout the project’s frontend codebase.</td>
								</tr>
							</table>
							<!-- contracts Submodule -->
							<details>
								<summary><b>contracts</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.types.contracts</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/contracts/common.ts'>common.ts</a></b></td>
											<td style='padding: 8px;'>- Defines TypeScript types and interfaces for strongly-typed Ethereum smart contract interactions within the web client<br>- Facilitates event handling, contract deployment, and type inference, ensuring type safety and consistency across the codebase<br>- Supports seamless integration with ethers.js, enabling reliable communication with blockchain contracts in the applications architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/contracts/Erc20.ts'>Erc20.ts</a></b></td>
											<td style='padding: 8px;'>- This code file defines the TypeScript type definitions for interacting with an ERC-20 token contract within the web-client module of the project<br>- It serves as a crucial interface that enables the frontend to securely and reliably invoke standard token operations—such as transfers, approvals, and allowance management—by providing strongly-typed methods aligned with the smart contracts functions<br>- Overall, it facilitates seamless integration between the web applications user interface and the blockchain's token layer, ensuring consistent and type-safe communication within the broader decentralized application architecture.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/contracts/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Defines and exports TypeScript types and factory interfaces for ERC20 smart contracts, facilitating seamless interaction with blockchain tokens within the web client<br>- Serves as a central reference point for contract type definitions and factory functions, ensuring type safety and streamlined integration across the applications codebase<br>- Supports efficient development and interaction with Ethereum-based token contracts.</td>
										</tr>
									</table>
									<!-- factories Submodule -->
									<details>
										<summary><b>factories</b></summary>
										<blockquote>
											<div class='directory-path' style='padding: 8px 0; color: #666;'>
												<code><b>⦿ web-client.src.types.contracts.factories</b></code>
											<table style='width: 100%; border-collapse: collapse;'>
											<thead>
												<tr style='background-color: #f8f9fa;'>
													<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
													<th style='text-align: left; padding: 8px;'>Summary</th>
												</tr>
											</thead>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/contracts/factories/Erc20__factory.ts'>Erc20__factory.ts</a></b></td>
													<td style='padding: 8px;'>- Facilitates interaction with ERC20 token contracts by providing a factory for creating contract instances and interfaces<br>- Enables seamless integration of ERC20 tokens into the web-client, supporting operations such as transfers, approvals, and balance inquiries within the overall blockchain architecture<br>- Ensures standardized, type-safe access to ERC20 functionalities across the project.</td>
												</tr>
												<tr style='border-bottom: 1px solid #eee;'>
													<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/types/contracts/factories/index.ts'>index.ts</a></b></td>
													<td style='padding: 8px;'>- Provides centralized exports of factory classes for ERC20 contract interfaces, facilitating streamlined access and integration within the web-client architecture<br>- Enhances modularity by consolidating contract factory references, supporting efficient interaction with blockchain tokens across the project’s frontend components<br>- This setup promotes maintainability and simplifies contract instantiation in the broader codebase.</td>
												</tr>
											</table>
										</blockquote>
									</details>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- common Submodule -->
					<details>
						<summary><b>common</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.common</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/Icon.vue'>Icon.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable SVG icon component within the web-client interface, enabling consistent and efficient rendering of icons across the application<br>- It leverages a centralized icon naming system to dynamically display various icons, supporting a cohesive visual language and streamlined icon management within the overall frontend architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AppFooter.vue'>AppFooter.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a responsive, internationalized footer component for the web application, displaying organizational information, contact details, and legal links<br>- It enhances user navigation and accessibility while maintaining consistent branding across pages, serving as a key element in the overall site architecture by ensuring essential information is readily available and visually cohesive.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AccordionItem.vue'>AccordionItem.vue</a></b></td>
									<td style='padding: 8px;'>- Implements an interactive accordion component that enables users to expand and collapse content sections within the web applications user interface<br>- Facilitates organized presentation of information, enhancing user experience by allowing dynamic content visibility management in the overall web client architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/Collapse.vue'>Collapse.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable collapsible component that enables smooth expand and collapse animations within the user interface<br>- It manages dynamic height transitions to enhance user experience, allowing content sections to toggle visibility seamlessly<br>- This component integrates into the overall architecture by facilitating interactive, animated UI elements that improve content organization and accessibility across the web client.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AppNavbar.vue'>AppNavbar.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a responsive navigation bar with branding, route links, and language selection, facilitating seamless user navigation across desktop and mobile views<br>- Manages menu toggling and language preferences, ensuring consistent accessibility and localization within the web applications overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/NoDataMessage.vue'>NoDataMessage.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable Vue component that displays a centered message with an icon when no data is available<br>- It enhances user experience by clearly communicating the absence of content across the web client interface, maintaining visual consistency and clarity within the applications data-driven views.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AppLogo.vue'>AppLogo.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a visual brand identifier within the web client by displaying the applications logo and linking it to the homepage<br>- It enhances user navigation and reinforces branding consistency across the interface, serving as a central visual anchor in the overall application architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AppButton.vue'>AppButton.vue</a></b></td>
									<td style='padding: 8px;'>- Defines a versatile, styled button component supporting navigation, external links, and actions within the web application<br>- It adapts its appearance and behavior based on props, enabling consistent UI elements across the project<br>- Serves as a core building block for user interactions, ensuring accessibility, visual consistency, and flexibility within the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/Loader.vue'>Loader.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a versatile loading component that displays either a spinner or skeleton placeholder based on the specified scheme<br>- It enhances user experience by visually indicating loading states within the web client, supporting seamless transitions during data fetches or processing<br>- This component integrates into the overall architecture to ensure consistent and customizable loading indicators across the application.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/TeleportModal.vue'>TeleportModal.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable Vue component for rendering modals via teleportation, enabling flexible overlay dialogs within the web-client architecture<br>- Facilitates modal display, centering, and outside click handling, ensuring seamless user interactions and consistent modal behavior across the application<br>- Integrates smoothly with the overall UI framework, supporting accessibility and user experience standards.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/Notification.vue'>Notification.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable Vue component for displaying styled notifications within the web client, supporting various message types such as success, error, warning, and info<br>- It standardizes notification presentation across the application, ensuring consistent visual cues and messaging, thereby enhancing user experience and communication clarity throughout the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/ErrorMessage.vue'>ErrorMessage.vue</a></b></td>
									<td style='padding: 8px;'>- Provides a reusable Vue component for displaying styled error messages within the web client<br>- It standardizes error presentation across the application, ensuring consistent visual cues and messaging for users<br>- This component enhances user experience by clearly communicating issues, supporting maintainability and uniformity in error handling throughout the frontend architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/NftMetadataModal.vue'>NftMetadataModal.vue</a></b></td>
									<td style='padding: 8px;'>- Provides an interactive modal component for displaying detailed NFT metadata, including images, attributes, owner info, and relevant links<br>- It fetches metadata dynamically based on token URI, handles IPFS normalization, and offers a user-friendly interface for exploring NFT details within the web application architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/AppButton.test.ts'>AppButton.test.ts</a></b></td>
									<td style='padding: 8px;'>- Provides unit tests for the AppButton component, ensuring its visual and functional consistency within the web-client<br>- Validates that the button renders correctly with expected classes and structure, supporting reliable UI behavior across the application<br>- Serves as a safeguard for maintaining design standards and component integrity within the overall frontend architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Provides centralized exports of common Vue components used throughout the web client, facilitating consistent UI elements and shared functionality<br>- Enhances maintainability by streamlining component imports, ensuring a cohesive user interface, and supporting efficient development across the applications architecture.</td>
								</tr>
							</table>
							<!-- loaders Submodule -->
							<details>
								<summary><b>loaders</b></summary>
								<blockquote>
									<div class='directory-path' style='padding: 8px 0; color: #666;'>
										<code><b>⦿ web-client.src.common.loaders</b></code>
									<table style='width: 100%; border-collapse: collapse;'>
									<thead>
										<tr style='background-color: #f8f9fa;'>
											<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
											<th style='text-align: left; padding: 8px;'>Summary</th>
										</tr>
									</thead>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/loaders/SkeletonTable.vue'>SkeletonTable.vue</a></b></td>
											<td style='padding: 8px;'>- Provides a reusable skeleton loader component that visually simulates table structures during data loading phases<br>- It enhances user experience by maintaining layout consistency and indicating ongoing content fetches within the web client<br>- Integrating seamlessly into the overall architecture, it supports responsive design and flexible configurations for various loading scenarios across the application.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/loaders/Skeleton.vue'>Skeleton.vue</a></b></td>
											<td style='padding: 8px;'>- Provides a reusable skeleton loader component to visually indicate loading states within the web client<br>- It supports different visual schemes such as thin, medium, and circular placeholders, enhancing user experience during data fetches or content rendering delays<br>- Integrates seamlessly into the overall architecture by standardizing loading indicators across the application’s UI components.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/loaders/Spinner.vue'>Spinner.vue</a></b></td>
											<td style='padding: 8px;'>- Provides a visual loading indicator to signal ongoing processes within the web client<br>- It enhances user experience by clearly communicating activity status during data fetching or operations, ensuring users understand when the application is busy<br>- The spinner component integrates seamlessly into the overall architecture, supporting responsive and consistent UI feedback across the platform.</td>
										</tr>
										<tr style='border-bottom: 1px solid #eee;'>
											<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/common/loaders/index.ts'>index.ts</a></b></td>
											<td style='padding: 8px;'>- Provides centralized access to common loading indicator components such as Spinner, Skeleton, and SkeletonTable, facilitating consistent visual feedback during asynchronous operations across the web-client application<br>- Enhances user experience by standardizing loading states and streamlining component imports within the project’s architecture.</td>
										</tr>
									</table>
								</blockquote>
							</details>
						</blockquote>
					</details>
					<!-- enums Submodule -->
					<details>
						<summary><b>enums</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.enums</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/window-breakpoints.enum.ts'>window-breakpoints.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines standardized window size breakpoints to facilitate responsive design across various devices within the web client<br>- These enumerations enable consistent layout adjustments and UI scaling, ensuring optimal user experience across different screen resolutions and device types throughout the applications architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/route-names.enum.ts'>route-names.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines a centralized enumeration of route names used throughout the web client, facilitating consistent navigation references across the application<br>- It enhances maintainability by providing a single source of truth for route identifiers, supporting clear routing logic and reducing errors in URL management within the overall project architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/chains.enum.ts'>chains.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Define and categorize blockchain networks used within the application, enabling seamless identification and interaction with various Ethereum and Solana chains<br>- Facilitates consistent referencing of chain IDs and types across the codebase, supporting multi-chain functionality and ensuring compatibility with different blockchain environments.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/icon-names.enum.ts'>icon-names.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines a comprehensive enumeration of icon names used throughout the web client, facilitating consistent icon referencing and management within the applications user interface<br>- Serves as a centralized resource to ensure uniformity and ease of use when integrating visual elements across various components of the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/decimals.enum.ts'>decimals.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines a standardized enumeration for Web3 decimal precision, specifically setting the WEI unit to 18 decimal places<br>- Facilitates consistent handling of cryptocurrency values across the web client, ensuring accurate conversions and calculations within the broader blockchain interaction architecture<br>- This enumeration supports reliable and uniform representation of token amounts throughout the application.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/providers.enum.ts'>providers.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines enumerations for supported wallet providers and their corresponding verification checks, facilitating consistent identification and handling of various Web3 wallet integrations within the application<br>- These enums enable streamlined provider management, ensuring the system can reliably recognize and differentiate between multiple wallet options and their specific capabilities across the codebase.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/rpc-error-codes.enum.ts'>rpc-error-codes.enum.ts</a></b></td>
									<td style='padding: 8px;'>- Defines standardized error codes and messages for handling RPC communication failures within the web client<br>- Facilitates consistent interpretation of errors from blockchain interactions, enabling robust error handling and user feedback across the application architecture<br>- Supports seamless integration with various blockchain protocols by categorizing common and protocol-specific error scenarios.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/enums/index.ts'>index.ts</a></b></td>
									<td style='padding: 8px;'>- Defines and consolidates key enumerations related to routing, icons, window breakpoints, providers, blockchain chains, and RPC error codes, facilitating consistent reference and usage across the web client<br>- Enhances maintainability and clarity within the applications architecture by centralizing essential constants used throughout the codebase.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- abi Submodule -->
					<details>
						<summary><b>abi</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.abi</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/abi/surveyNft.ts'>surveyNft.ts</a></b></td>
									<td style='padding: 8px;'>- Defines the interface for interacting with the SurveyNFT smart contract, enabling functionalities such as claiming NFTs based on survey participation, burning tokens, and managing access control roles<br>- Serves as a crucial bridge between the web client and blockchain, facilitating secure and structured communication with the SurveyNFT contract within the overall decentralized survey platform architecture.</td>
								</tr>
							</table>
						</blockquote>
					</details>
					<!-- lib Submodule -->
					<details>
						<summary><b>lib</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client.src.lib</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/src/lib/gsn-client.v5.ts'>gsn-client.v5.ts</a></b></td>
									<td style='padding: 8px;'>- Facilitates interaction with the OpenGSN network by providing functions to obtain a GSN-enabled signer, execute transactions, and ensure proper network configuration on Polygon<br>- Integrates seamlessly with the web client to enable gasless transactions and streamline blockchain interactions within the overall architecture, enhancing user experience through simplified and reliable contract communication.</td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- .helm Submodule -->
			<details>
				<summary><b>.helm</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ web-client..helm</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/.helmignore'>.helmignore</a></b></td>
							<td style='padding: 8px;'>- Defines patterns to exclude from package builds, ensuring that unnecessary or sensitive files such as version control directories, IDE configurations, and temporary files are omitted<br>- This helps maintain a clean, efficient deployment process within the web-client component, supporting smooth packaging and deployment workflows across the overall architecture.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/Chart.yaml'>Chart.yaml</a></b></td>
							<td style='padding: 8px;'>- Defines the Helm chart for deploying the web client application on Kubernetes, specifying its configuration and versioning<br>- It facilitates streamlined deployment, management, and version control of the web client within the broader architecture, ensuring consistent and reliable application delivery in the Kubernetes environment.</td>
						</tr>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/values.yaml'>values.yaml</a></b></td>
							<td style='padding: 8px;'>- Defines deployment configurations for the web client within a Kubernetes environment, including image details, ingress settings, resource allocations, and environment variables<br>- Facilitates flexible, scalable, and secure deployment of the web interface, ensuring proper routing, resource management, and environment customization aligned with the overall architecture.</td>
						</tr>
					</table>
					<!-- templates Submodule -->
					<details>
						<summary><b>templates</b></summary>
						<blockquote>
							<div class='directory-path' style='padding: 8px 0; color: #666;'>
								<code><b>⦿ web-client..helm.templates</b></code>
							<table style='width: 100%; border-collapse: collapse;'>
							<thead>
								<tr style='background-color: #f8f9fa;'>
									<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
									<th style='text-align: left; padding: 8px;'>Summary</th>
								</tr>
							</thead>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/NOTES.txt'>NOTES.txt</a></b></td>
									<td style='padding: 8px;'>- Provides user guidance for accessing the deployed web application across various Kubernetes service types, including ingress, NodePort, LoadBalancer, and ClusterIP<br>- It ensures seamless connectivity by generating appropriate URLs or port-forward commands, thereby integrating deployment configurations into accessible endpoints within the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/ingress.yaml'>ingress.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines Kubernetes ingress resources to manage external HTTP and HTTPS traffic routing for the web client application<br>- It configures domain-based routing, TLS termination, and ingress class specifications, ensuring seamless and secure access to services across different Kubernetes versions within the overall deployment architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/service.yaml'>service.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines a Kubernetes Service to expose the web client application within the cluster or externally, depending on configuration<br>- It manages network access by specifying ports and selectors, enabling seamless communication between the web client and other services in the architecture<br>- This component is essential for routing traffic and ensuring reliable connectivity in the overall deployment.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/registry.yaml'>registry.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines a Kubernetes secret for Docker registry authentication, enabling secure image pulling within the web-client deployment<br>- Integrates registry credentials into the Helm chart, ensuring seamless access to container images from private registries as part of the overall deployment architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/_helpers.tpl'>_helpers.tpl</a></b></td>
									<td style='padding: 8px;'>- Defines reusable Helm template helpers for consistent naming, labeling, and resource identification within Kubernetes deployments<br>- Facilitates standardized chart naming, full app names, labels, and service account configurations, ensuring uniformity and adherence to Kubernetes naming conventions across the web-client deployment architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/configmap.yaml'>configmap.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines a Kubernetes ConfigMap that centralizes environment configuration for the web client, specifying storage endpoints and web URLs<br>- It dynamically adapts to local or cloud storage setups based on deployment settings, ensuring consistent environment variables across different deployment environments within the overall architecture.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/deployment.yaml'>deployment.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines the deployment configuration for the web client within the Kubernetes cluster, orchestrating containerized application deployment, resource allocation, and health monitoring<br>- It ensures the web client is reliably instantiated with appropriate settings, labels, and security contexts, integrating seamlessly into the overall architecture to facilitate scalable, resilient access to the applications frontend interface.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/hpa.yaml'>hpa.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines horizontal pod autoscaling policies for the web client deployment, enabling dynamic adjustment of replica counts based on CPU and memory utilization<br>- Facilitates efficient resource management and ensures application availability by automatically scaling the deployment within specified limits, aligning with overall infrastructure architecture and performance objectives.</td>
								</tr>
								<tr style='border-bottom: 1px solid #eee;'>
									<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/.helm/templates/serviceaccount.yaml'>serviceaccount.yaml</a></b></td>
									<td style='padding: 8px;'>- Defines the Kubernetes ServiceAccount resource for the web-client deployment, enabling secure and manageable access control within the cluster<br>- It facilitates identity management for the web-client application, ensuring proper permissions and integration with other Kubernetes components, thereby supporting the overall architectures modularity and security posture.</td>
								</tr>
							</table>
						</blockquote>
					</details>
				</blockquote>
			</details>
			<!-- scripts Submodule -->
			<details>
				<summary><b>scripts</b></summary>
				<blockquote>
					<div class='directory-path' style='padding: 8px 0; color: #666;'>
						<code><b>⦿ web-client.scripts</b></code>
					<table style='width: 100%; border-collapse: collapse;'>
					<thead>
						<tr style='background-color: #f8f9fa;'>
							<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
							<th style='text-align: left; padding: 8px;'>Summary</th>
						</tr>
					</thead>
						<tr style='border-bottom: 1px solid #eee;'>
							<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/web-client/scripts/release-sanity-check.mjs'>release-sanity-check.mjs</a></b></td>
							<td style='padding: 8px;'>- Performs comprehensive validation of release readiness by ensuring version consistency across package files and changelog accuracy<br>- It verifies semantic versioning, confirms the latest changelog entry matches the current version, and checks proper changelog formatting and anchors<br>- Facilitates reliable release processes by catching discrepancies early, maintaining documentation integrity, and ensuring alignment between codebase and release notes.</td>
						</tr>
					</table>
				</blockquote>
			</details>
		</blockquote>
	</details>
	<!-- gsn Submodule -->
	<details>
		<summary><b>gsn</b></summary>
		<blockquote>
			<div class='directory-path' style='padding: 8px 0; color: #666;'>
				<code><b>⦿ gsn</b></code>
			<table style='width: 100%; border-collapse: collapse;'>
			<thead>
				<tr style='background-color: #f8f9fa;'>
					<th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
					<th style='text-align: left; padding: 8px;'>Summary</th>
				</tr>
			</thead>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/gsn/build-gsn.mjs'>build-gsn.mjs</a></b></td>
					<td style='padding: 8px;'>- Generates a browser-compatible, bundled version of the GSN (Gas Station Network) SDK for seamless integration into web applications<br>- It consolidates dependencies, polyfills Node.js globals, and applies necessary shims to ensure compatibility across environments<br>- This build artifact enables developers to easily incorporate GSN functionalities into client-side projects with optimized, ready-to-use code.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/gsn/GSN_README.md'>GSN_README.md</a></b></td>
					<td style='padding: 8px;'>- Provides a browser-compatible UMD bundle for the OpenGSN provider, enabling gasless transactions without relying on external CDNs<br>- It ensures a stable, local copy of the GSN library, facilitating easy integration and performance optimization in web applications<br>- The bundle exposes the RelayProvider globally, supporting both static and lazy-loading usage patterns for seamless gasless operations.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/gsn/web3-global-shim.js'>web3-global-shim.js</a></b></td>
					<td style='padding: 8px;'>- Provides a global reference to the Web3 instance, ensuring consistent access across the codebase<br>- It verifies the presence of the Web3 library loaded in the browser environment and exports it for use in decentralized application interactions<br>- This setup facilitates seamless integration with Ethereum-based functionalities within the overall architecture.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/gsn/package.json'>package.json</a></b></td>
					<td style='padding: 8px;'>- Defines the build process for the GSN UMD bundle, enabling the creation of a browser-compatible version of the OpenGSN provider and related dependencies<br>- It consolidates and prepares the JavaScript modules for deployment in web environments, ensuring seamless integration and functionality within decentralized applications that leverage the GSN protocol.</td>
				</tr>
				<tr style='border-bottom: 1px solid #eee;'>
					<td style='padding: 8px;'><b><a href='https://github.com/jorisstrakeljahn/survey-nft/blob/master/gsn/expose-gsn.js'>expose-gsn.js</a></b></td>
					<td style='padding: 8px;'>- Expose the RelayProvider from the OpenGSN library to the global window object, enabling seamless access across the application<br>- It facilitates integration of the GSN (Gas Station Network) by making the relay provider readily available for client-side interactions, thereby supporting decentralized transaction relaying within the broader architecture.</td>
				</tr>
			</table>
		</blockquote>
	</details>
</details>

---

## Getting Started

### Prerequisites

This project requires the following dependencies:

- **Programming Language:** TypeScript
- **Package Manager:** Npm

### Installation

Build survey-nft from the source and install dependencies:

1. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/jorisstrakeljahn/survey-nft
    ```

2. **Navigate to the project directory:**

    ```sh
    ❯ cd survey-nft
    ```

3. **Install the dependencies:**

**Using [npm](https://www.npmjs.com/):**

```sh
❯ npm install
```

### Usage

Run the project with:

**Using [npm](https://www.npmjs.com/):**

```sh
npm start
```

