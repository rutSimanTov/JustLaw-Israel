export async function runLiveTranslation(lang: string) {
  if (lang === 'en') return;

  try {
    const translations = await import(`./translations/${lang}.json`).then((mod) => mod.default || mod);

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const text = node.nodeValue?.trim();
          if (!text) return NodeFilter.FILTER_SKIP;
          if (text.length < 2) return NodeFilter.FILTER_SKIP;
          if (!translations[text]) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node: Text | null = walker.nextNode() as Text | null;
    while (node) {
      const original = node.nodeValue!.trim();
      const translated = translations[original];
      if (translated) {
        node.nodeValue = translated;
      }
      node = walker.nextNode() as Text | null;
    }

    console.log(`🔠 Live translation applied: ${lang}`);
  } catch (err) {
    console.error('⚠️ Failed to apply live translation', err);
  }
}

// import { getTranslation } from "./translationService";

// export async function runLiveTranslation(lang: string) {
//   if (lang === "en") return;

//   const walker = document.createTreeWalker(
//     document.body,
//     NodeFilter.SHOW_TEXT,
//     {
//       acceptNode: (node) => {
//         const text = node.nodeValue?.trim();
//         if (!text) return NodeFilter.FILTER_SKIP;
//         if (text.length < 2) return NodeFilter.FILTER_SKIP;
//         return NodeFilter.FILTER_ACCEPT;
//       },
//     }
//   );

//   let node: Text | null = walker.nextNode() as Text | null;
//   while (node) {
//     const original = node.nodeValue!.trim();

//     try {
//       const translated = await getTranslation(original, lang as any);
//       if (translated && translated !== original) {
//         node.nodeValue = translated;
//       }
//     } catch (e) {
//       console.warn(`❌ תרגום נכשל עבור: ${original}`);
//     }

//     node = walker.nextNode() as Text | null;
//   }

//   console.log(`🔠 תרגום חי בוצע לשפה: ${lang}`);
// }
