// ============================================================
// DIAGNÓSTICO DE LARGURA — A2M System
//
// COMO USAR (no celular, com o site aberto):
//   1. Chrome no Android → menu ⋮ → "Site para computador" DESMARCADO
//   2. Conecte o celular no PC por USB (Depuração USB ativada)
//   3. No PC: chrome://inspect → "inspect" na aba do celular
//   4. Cole este código no Console e dê Enter
//
// ALTERNATIVA SEM CABO:
//   Abra o site no PC, aperte F12, ative o modo celular (Ctrl+Shift+M),
//   escolha um aparelho (ex: Galaxy S20), e cole isto no Console.
//
// O resultado mostra QUAIS elementos passam da largura da tela.
// ============================================================

(function diagnosticarLargura() {
  const limite = document.documentElement.clientWidth;
  const culpados = [];

  document.querySelectorAll('*').forEach(el => {
    // ignora o que está escondido
    if (!el.offsetParent && el.tagName !== 'BODY') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;

    // passa da borda direita da tela?
    if (r.right > limite + 1 || r.left < -1) {
      culpados.push({
        el,
        excesso: Math.round(r.right - limite),
        largura: Math.round(r.width),
        tag: el.tagName.toLowerCase(),
        classe: (el.className || '').toString().slice(0, 45),
        id: el.id || ''
      });
    }
  });

  console.clear();
  console.log('%c DIAGNÓSTICO DE LARGURA ', 'background:#1A2332;color:#fff;padding:4px 10px;font-weight:bold');
  console.log('Largura da tela:', limite + 'px');
  console.log('Elementos que estouram:', culpados.length);

  if (!culpados.length) {
    console.log('%c Nenhum elemento estourando nesta tela. ', 'background:#1A8A4A;color:#fff;padding:3px 8px');
    return;
  }

  // Os que mais estouram primeiro
  culpados.sort((a, b) => b.excesso - a.excesso);

  console.table(
    culpados.slice(0, 15).map(c => ({
      tag: c.tag,
      id: c.id,
      classe: c.classe,
      'largura(px)': c.largura,
      'excesso(px)': c.excesso
    }))
  );

  // Pinta de vermelho os 5 piores para você ver na tela
  culpados.slice(0, 5).forEach(c => {
    c.el.style.outline = '3px solid red';
    c.el.style.outlineOffset = '-3px';
  });
  console.log('%c Os 5 piores foram contornados de VERMELHO na tela. ', 'background:#CC2222;color:#fff;padding:3px 8px');
  console.log('Elemento campeão:', culpados[0].el);
})();
