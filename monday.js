const monday = window.mondaySdk();

async function loadIframe() {
  try {
    // Obtener contexto del ítem
    const contextRes = await monday.get("context");
    const itemId = contextRes.data?.itemId;

    console.log("🟢 Contexto recibido:", contextRes.data);

    if (!itemId) {
      document.getElementById("iframe-container").innerHTML =
        "<p style='color:red;'>No se encontró itemId en el contexto.</p>";
      return;
    }

    // Hacer la consulta a la API de monday para obtener el valor de la columna
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

    const response = await monday.api(query);
    console.log("🟢 Respuesta de API:", response);

    const columnData = response.data?.items?.[0]?.column_values?.[0];
    const url = columnData?.text;

    const container = document.getElementById("iframe-container");

    if (url && url.startsWith("http")) {
      container.innerHTML = `
        <p><strong>URL detectada:</strong> ${url}</p>
        <iframe src="${url}" allowfullscreen></iframe>
      `;
    } else {
      container.innerHTML = `
        <p style="color:red;"><strong>No se encontró una URL válida en la columna.</strong></p>
        <p>Verifica que la columna <code>text_mknys7ye</code> tenga un enlace válido.</p>
      `;
    }
  } catch (error) {
    console.error("❌ Error general:", error);
    document.getElementById("iframe-container").innerHTML = `
      <p style="color:red;">Ocurrió un error al cargar la información desde Monday.</p>
      <pre>${JSON.stringify(error, null, 2)}</pre>
    `;
  }
}

loadIframe();
