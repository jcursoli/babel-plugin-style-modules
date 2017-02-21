export default function (exts, sourceName) {
  const extension = ~sourceName.indexOf('.') ? sourceName.split('.').pop() : null;
  if (!extension) { return false; }
  if (exts[extension] === false) { return false; }
  if (exts[extension] === true) { return true; }
  return sourceName.endsWith('.css');
}
