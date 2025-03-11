const monday = window.mondaySdk();

monday.listen("context", (res) => {
  const { itemId } = res.data;

  console.log("Contexto recibido:", res.data);

  const query = `
    query {
      items(ids: ${itemId}) {
        column_values(ids: ["text_mknys7ye"]) {
          id
          text
          value
        }
      }
    }
  `;

  monday.api(query).then((res) => {
    console.log("Respuesta de la API:", res);

    const container = document.getElementById("iframe-container");

    const columnData = res.data?.items?.[0]?.column_values?.[0];
    const url = columnData?.text;

    if (url) {
      console.log("URL encontrada:", url);
      container.innerHTML = `
        <p><strong>URL detectada:</strong> ${url}</p>
        <iframe src="${url}" allowfullscreen></iframe>
      `;
    } else {
      console.warn("No se encontró una URL válida en la columna.");
      container.innerHTML = `
        <p style="color: red;"><strong>No se encontró una URL válida en la columna.</strong></p>
        <p>¿Seguro que el elemento tiene contenido en la columna <code>text_mknys7ye</code>?</p>
      `;
    }
  }).catch((error) => {
    console.error("Error en la API de Monday:", error);
    document.getElementById("iframe-container").innerHTML = `
      <p style="color: red;">Ocurrió un error al consultar Monday.</p>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    `;
  });
});
