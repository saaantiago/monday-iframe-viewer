const monday = window.mondaySdk();

// Escuchar el contexto del elemento abierto
monday.listen("context", (res) => {
  const { itemId } = res.data;

  console.log("🟢 Contexto recibido desde Monday:", res.data);

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

  // Hacer la consulta a la API de monday
  monday.api(query)
    .then((response) => {
      console.log("🟢 Respuesta de la API:", response);

      const container = document.getElementById("iframe-container");
      const columnData = response.data?.items?.[0]?.column_values?.[0];
      const url = columnData?.text;

      if (url && url.startsWith("http")) {
        console.log("🟢 URL encontrada:", url);
        container.innerHTML = `
          <p><strong>URL detectada:</strong> ${url}</p>
          <iframe src="${url}" allowfullscreen></iframe>
        `;
      } else {
        console.warn("⚠️ No se encontró una URL válida en la columna.");
        container.innerHTML = `
          <p style="color: red;"><strong>No se encontró una URL válida en la columna.</strong></p>
          <p>Verifica que el elemento tenga una URL válida en <code>text_mknys7ye</code>.</p>
        `;
      }
    })
    .catch((error) => {
      console.error("❌ Error al hacer la consulta a Monday:", error);
      document.getElementById("iframe-container").innerHTML = `
        <p style="color: red;"><strong>Ocurrió un error al consultar Monday.com.</strong></p>
        <pre>${JSON.stringify(error, null, 2)}</pre>
      `;
    });
});
