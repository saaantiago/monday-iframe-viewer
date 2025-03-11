const monday = window.mondaySdk();

monday.listen("context", (res) => {
  const { itemId } = res.data;

  const query = `
    query {
      items(ids: ${itemId}) {
        column_values(ids: ["text_mknys7ye"]) {
          text
        }
      }
    }
  `;

  monday.api(query).then((res) => {
    const container = document.getElementById("iframe-container");
    const url = res.data?.items?.[0]?.column_values?.[0]?.text;

    if (url && url.startsWith("http")) {
      container.innerHTML = `<iframe src="${url}" allowfullscreen></iframe>`;
    } else {
      container.innerHTML = `<p>No se encontró una URL válida en la columna.</p>`;
    }
  });
});
