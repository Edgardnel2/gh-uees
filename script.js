// Markdown básico sin dependencias. El HTML del archivo se muestra como texto.
function inline(text, parent) {
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    parent.append(document.createTextNode(text.slice(offset, match.index)));
    let node;
    if (match[1]) {
      let url;
      try { url = new URL(match[2], location.href); } catch {}
      if (url && ['https:', 'http:', 'mailto:'].includes(url.protocol)) {
        node = document.createElement('a');
        node.href = url.href;
        node.textContent = match[1];
      }
    } else {
      node = document.createElement(match[3] ? 'strong' : 'code');
      node.textContent = match[3] || match[4];
    }
    parent.append(node || document.createTextNode(match[0]));
    offset = match.index + match[0].length;
  }
  parent.append(document.createTextNode(text.slice(offset)));
}
function renderMarkdown(source) {
  const result = document.createDocumentFragment();
  let list = null;
  let code = null;
  for (const line of source.replace(/\r\n?/g, '\n').split('\n')) {
    if (line.startsWith('```')) {
      if (code) code = null;
      else {
        const pre = document.createElement('pre');
        code = document.createElement('code');
        pre.append(code); result.append(pre);
      }
      list = null; continue;
    }
    if (code) { code.append(document.createTextNode(line + '\n')); continue; }
    if (!line.trim()) { list = null; continue; }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const item = line.match(/^[-*]\s+(.+)$/);
    if (item) {
      if (!list) { list = document.createElement('ul'); result.append(list); }
      const li = document.createElement('li'); inline(item[1], li); list.append(li);
    } else {
      list = null;
      const element = document.createElement(heading ? 'h' + heading[1].length : 'p');
      inline(heading ? heading[2] : line, element); result.append(element);
    }
  }
  return result;
}
async function loadPeople() {
  const container = document.getElementById('people');
  try {
    const response = await fetch('/people.md', { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const source = await response.text();
    if (!source.trim()) container.textContent = 'Todavía no hay personas para mostrar.';
    else container.replaceChildren(renderMarkdown(source));
  } catch (error) {
    container.textContent = 'No se pudo cargar people.md. Revisá que el archivo exista y abrí la página desde un servidor HTTP.';
    console.error('Error al cargar people.md:', error);
  } finally { container.setAttribute('aria-busy', 'false'); }
}
loadPeople();
