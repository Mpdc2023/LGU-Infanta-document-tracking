document.addEventListener('DOMContentLoaded', () => {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQbJUW3V9paTSTPAXRDV-fKTiKmQ8UUEQRDV6wkYpFL_4o0KRMIvpZBWXOnPiq2IAZ6cXNZACw4jMrkpub?output=csv';
  const documentList = document.getElementById('documentList');
  const searchInput = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('suggestions');

  let documents = [];

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function (results) {
      documents = results.data.filter(doc => doc.Title && doc.Link && doc.ID);
      displayDocuments(documents);
    },
    error: function (err) {
      console.error("Error loading CSV:", err);
    }
  });

  function displayDocuments(docs) {
    documentList.innerHTML = '';

    if (docs.length === 0) {
      documentList.innerHTML = '<p>No documents found.</p>';
      return;
    }

    docs.forEach(doc => {
      const card = document.createElement('div');
      card.className = 'document-card';
      card.innerHTML = `
        <div class="doc-title"><a href="${doc.Link}" target="_blank">${doc.Title}</a></div>
      `;
      documentList.appendChild(card);
    });
  }

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    const filtered = documents.filter(doc =>
      doc.Title.toLowerCase().includes(term)
    );
    displayDocuments(filtered);
    showSuggestions(term);
  });

  function showSuggestions(term) {
    suggestionsBox.innerHTML = '';
    if (!term) {
      suggestionsBox.style.display = 'none';
      return;
    }

    const matches = documents
      .filter(doc => doc.Title.toLowerCase().includes(term))
      .slice(0, 5);

    if (matches.length === 0) {
      suggestionsBox.style.display = 'none';
      return;
    }

    matches.forEach(doc => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = doc.Title;
      div.addEventListener('click', () => {
        searchInput.value = doc.Title;
        displayDocuments([doc]);
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
      });
      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = 'block';
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';
    }
  });
});
