import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      // Rastrea solo tus componentes, servicios y lógica de Angular
      include: ['src/app/**/*.ts'],
      // Excluye archivos que no contienen lógica ejecutable
      exclude: ['src/app/**/*.dto.ts', 'src/app/**/*.model.ts', 'src/main.ts'],
    },
  },
});
