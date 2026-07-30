// Empty stub used by the Turbopack `resolveAlias` in next.config.mjs.
//
// pdfjs-dist declares an optional dependency on `canvas` for rendering PDFs in
// Node. In the browser it uses the DOM canvas instead and never touches this
// package, but the bare import still has to resolve during the client build.
// Aliasing it here keeps the client bundle from carrying a Node-only native module.
export default {};
