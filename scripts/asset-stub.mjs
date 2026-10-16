// Para o Node conseguir importar os dados do site (src/data): imagens e CSS viram texto vazio,
// porque o prerender só precisa de títulos e descrições, não dos arquivos.
const ASSET = /\.(webp|png|jpe?g|gif|svg|avif|css|woff2?)$/;

export async function resolve(specifier, context, next) {
  // os imports do src não têm extensão (ex.: "./translations"): tenta .js
  try {
    return await next(specifier, context);
  } catch (error) {
    if (specifier.startsWith(".") && !/\.[a-z0-9]+$/i.test(specifier)) {
      return next(`${specifier}.js`, context);
    }
    throw error;
  }
}

export async function load(url, context, next) {
  if (ASSET.test(url)) {
    return { format: "module", source: "export default '';", shortCircuit: true };
  }
  return next(url, context);
}
