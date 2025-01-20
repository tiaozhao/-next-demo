import jsdom from "jsdom";
const { JSDOM } = jsdom;

export function parseHTML(html: string) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  
  // Remove main tag and its content
  const mainTags = doc.getElementsByTagName('main');
  while(mainTags.length > 0) {
    mainTags[0].parentNode?.removeChild(mainTags[0]);
  }

  // Get head content (excluding scripts)
  const headContent = Array.from(doc.head.children)
    .filter(el => el.tagName.toLowerCase() !== 'script')
    .map(el => el.outerHTML)
    .join('');
  
  // Get body content (excluding scripts)
  const bodyContent = Array.from(doc.body.children)
    .filter(el => el.tagName.toLowerCase() !== 'script')
    .map(el => el.outerHTML)
    .join('');
  
  return {
    head: headContent,
    body: bodyContent
  };
} 