import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import path from "path";

import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [react(), tsconfigPaths()],

	base: "/spam-classifier-react-fastapi-ml/",

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
