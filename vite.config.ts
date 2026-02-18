
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files. 
  // An empty string as the third argument allows loading variables without the VITE_ prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Try to find the API key in various common environment variable names
  const apiKey = env.API_KEY || env.VITE_API_KEY || env.GEMINI_API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Explicitly define process.env.API_KEY as a global constant for the client.
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Provide a mock process.env object to avoid "process is not defined" errors in the browser.
      'process.env': JSON.stringify({
        ...env,
        API_KEY: apiKey
      }),
    },
    server: {
      port: 5173,
      strictPort: true,
      open: true, // Automatically open the browser
    }
  };
});
