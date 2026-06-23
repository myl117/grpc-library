import { LibraryServiceClient } from "./proto/library_grpc_web_pb";
import {
  Empty,
  BookRequest,
  CreateBookRequest,
  UpdateBookRequest,
} from "./proto/library_pb";

// ── gRPC client ──────────────────────────────────────────────────────────────
const GRPC_HOST = "http://localhost:8282";
const client = new LibraryServiceClient(GRPC_HOST, null, null);

// ── State ────────────────────────────────────────────────────────────────────
let allBooks = [];           // master list from server
let filteredBooks = [];      // after search + filter
let editingId = null;        // null = create mode, number = edit mode
let pendingDeleteId = null;  // book id waiting for confirmation
let currentFilter = "all";
let searchQuery = "";

// ── DOM refs ─────────────────────────────────────────────────────────────────
const grid          = document.getElementById("book-grid");
const emptyState    = document.getElementById("empty-state");
const modalOverlay  = document.getElementById("modal-overlay");
const deleteOverlay = document.getElementById("delete-overlay");
const statusDot     = document.getElementById("status-dot");
const statusText    = document.getElementById("status-text");

const statTotal     = document.getElementById("stat-total");
const statAvailable = document.getElementById("stat-available");
const statOut       = document.getElementById("stat-out");

const formTitle     = document.getElementById("form-title");
const formAuthor    = document.getElementById("form-author");
const formIsbn      = document.getElementById("form-isbn");
const formYear      = document.getElementById("form-year");
const formDesc      = document.getElementById("form-description");
const formCoverUrl  = document.getElementById("form-cover-url");
const formAvailable = document.getElementById("form-available");
const coverPreview  = document.getElementById("cover-preview");
const modalTitle    = document.getElementById("modal-title");
const saveBtnText   = document.getElementById("save-btn-text");
const saveBtn       = document.getElementById("modal-save");
const olSearchInput = document.getElementById("ol-search-input");
const olResults     = document.getElementById("ol-results");

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, type = "info", icon = "ℹ️") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("out");
    toast.addEventListener("animationend", () => toast.remove());
  }, 3200);
}

const toastSuccess = (msg) => showToast(msg, "success", "✅");
const toastError   = (msg) => showToast(msg, "error",   "❌");
const toastInfo    = (msg) => showToast(msg, "info",    "💜");

// ── Status indicator ─────────────────────────────────────────────────────────
function setStatus(ok, text) {
  statusDot.style.background = ok ? "var(--accent-success)" : "var(--accent-danger)";
  statusDot.style.boxShadow  = ok ? "0 0 8px var(--accent-success)" : "0 0 8px var(--accent-danger)";
  statusText.textContent = text;
}

// ── Stats ────────────────────────────────────────────────────────────────────
function updateStats() {
  const available = allBooks.filter(b => b.available).length;
  statTotal.textContent     = allBooks.length;
  statAvailable.textContent = available;
  statOut.textContent       = allBooks.length - available;
}

// ── Filter & Search ───────────────────────────────────────────────────────────
function applyFilter() {
  let result = [...allBooks];

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    result = result.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      (b.isbn && b.isbn.includes(q))
    );
  }

  if (currentFilter === "available")   result = result.filter(b => b.available);
  if (currentFilter === "unavailable") result = result.filter(b => !b.available);

  filteredBooks = result;
  renderGrid();
}

// ── Render ────────────────────────────────────────────────────────────────────
function renderGrid() {
  // Remove all non-skeleton, non-empty-state children
  Array.from(grid.children).forEach(el => {
    if (!el.classList.contains("skeleton-card") && el.id !== "empty-state") {
      el.remove();
    }
  });

  if (filteredBooks.length === 0) {
    emptyState.classList.add("visible");
    return;
  }

  emptyState.classList.remove("visible");

  filteredBooks.forEach((book, i) => {
    const card = buildCard(book);
    card.style.animationDelay = `${i * 35}ms`;
    grid.appendChild(card);
  });
}

function buildCard(book) {
  const card = document.createElement("div");
  card.className = "book-card entering";
  card.setAttribute("role", "listitem");
  card.dataset.id = book.id;

  const hasCover = book.coverUrl && book.coverUrl.trim();
  const initial  = (book.title || "?")[0].toUpperCase();
  const availBadge = book.available
    ? `<span class="availability-badge available">✓ Available</span>`
    : `<span class="availability-badge unavailable">✗ Checked Out</span>`;
  const yearBadge = book.publishedYear
    ? `<span class="year-badge">${book.publishedYear}</span>`
    : "";

  card.innerHTML = `
    <div class="book-cover-wrap">
      ${hasCover
        ? `<img class="book-cover-img" src="${escapeAttr(book.coverUrl)}" alt="Cover of ${escapeAttr(book.title)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="book-cover-placeholder" style="display:none"><span class="book-initial">${escapeHtml(initial)}</span></div>`
        : `<div class="book-cover-placeholder"><span class="book-initial">${escapeHtml(initial)}</span></div>`
      }
      ${availBadge}
      ${yearBadge}
    </div>
    <div class="book-body">
      <div class="book-title">${escapeHtml(book.title)}</div>
      <div class="book-author">by ${escapeHtml(book.author)}</div>
      ${book.isbn ? `<div class="book-isbn">ISBN: ${escapeHtml(book.isbn)}</div>` : ""}
      ${book.description ? `<div class="book-desc">${escapeHtml(book.description)}</div>` : ""}
      <div class="book-actions">
        <button class="btn-edit" data-id="${book.id}" aria-label="Edit ${escapeAttr(book.title)}">✏️ Edit</button>
        <button class="btn-delete" data-id="${book.id}" aria-label="Delete ${escapeAttr(book.title)}">🗑️ Delete</button>
      </div>
    </div>
  `;

  card.querySelector(".btn-edit").addEventListener("click", () => openEditModal(book));
  card.querySelector(".btn-delete").addEventListener("click", () => openDeleteConfirm(book));

  return card;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function escapeAttr(str) {
  return String(str ?? "").replace(/"/g, "&quot;");
}

// Remove skeleton cards after first load
function clearSkeletons() {
  document.querySelectorAll(".skeleton-card").forEach(el => el.remove());
}

// ── gRPC: ListBooks ───────────────────────────────────────────────────────────
function loadBooks() {
  const req = new Empty();
  client.listBooks(req, {}, (err, res) => {
    clearSkeletons();
    if (err) {
      setStatus(false, "Server unreachable");
      toastError("Could not connect to gRPC server. Is it running?");
      emptyState.classList.add("visible");
      return;
    }

    setStatus(true, "Connected · gRPC");
    allBooks = res.getBooksList().map(bookResponseToObj);
    updateStats();
    applyFilter();
  });
}

function bookResponseToObj(b) {
  return {
    id:            b.getId(),
    title:         b.getTitle(),
    author:        b.getAuthor(),
    available:     b.getAvailable(),
    isbn:          b.getIsbn(),
    description:   b.getDescription(),
    coverUrl:      b.getCoverUrl(),
    publishedYear: b.getPublishedYear(),
  };
}

// ── gRPC: CreateBook ──────────────────────────────────────────────────────────
function createBook(data) {
  const req = new CreateBookRequest();
  req.setTitle(data.title);
  req.setAuthor(data.author);
  req.setAvailable(data.available);
  req.setIsbn(data.isbn);
  req.setDescription(data.description);
  req.setCoverUrl(data.coverUrl);
  req.setPublishedYear(data.publishedYear);

  return new Promise((resolve, reject) => {
    client.createBook(req, {}, (err, res) => {
      if (err) return reject(err);
      resolve(bookResponseToObj(res));
    });
  });
}

// ── gRPC: UpdateBook ──────────────────────────────────────────────────────────
function updateBook(id, data) {
  const req = new UpdateBookRequest();
  req.setId(id);
  req.setTitle(data.title);
  req.setAuthor(data.author);
  req.setAvailable(data.available);
  req.setIsbn(data.isbn);
  req.setDescription(data.description);
  req.setCoverUrl(data.coverUrl);
  req.setPublishedYear(data.publishedYear);

  return new Promise((resolve, reject) => {
    client.updateBook(req, {}, (err, res) => {
      if (err) return reject(err);
      resolve(bookResponseToObj(res));
    });
  });
}

// ── gRPC: DeleteBook ──────────────────────────────────────────────────────────
function deleteBook(id) {
  const req = new BookRequest();
  req.setId(id);

  return new Promise((resolve, reject) => {
    client.deleteBook(req, {}, (err, res) => {
      if (err) return reject(err);
      resolve(res.getSuccess());
    });
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openCreateModal() {
  editingId = null;
  modalTitle.textContent = "Add Book";
  saveBtnText.textContent = "Save Book";
  clearForm();
  openModal();
}

function openEditModal(book) {
  editingId = book.id;
  modalTitle.textContent = "Edit Book";
  saveBtnText.textContent = "Update Book";
  populateForm(book);
  openModal();
}

function openModal() {
  olResults.innerHTML = "";
  olSearchInput.value = "";
  modalOverlay.classList.add("open");
  setTimeout(() => formTitle.focus(), 100);
}

function closeModal() {
  modalOverlay.classList.remove("open");
  editingId = null;
}

function clearForm() {
  formTitle.value     = "";
  formAuthor.value    = "";
  formIsbn.value      = "";
  formYear.value      = "";
  formDesc.value      = "";
  formCoverUrl.value  = "";
  formAvailable.checked = true;
  updateCoverPreview("");
}

function populateForm(book) {
  formTitle.value     = book.title || "";
  formAuthor.value    = book.author || "";
  formIsbn.value      = book.isbn || "";
  formYear.value      = book.publishedYear || "";
  formDesc.value      = book.description || "";
  formCoverUrl.value  = book.coverUrl || "";
  formAvailable.checked = book.available;
  updateCoverPreview(book.coverUrl);
}

function getFormData() {
  return {
    title:         formTitle.value.trim(),
    author:        formAuthor.value.trim(),
    isbn:          formIsbn.value.trim(),
    publishedYear: parseInt(formYear.value) || 0,
    description:   formDesc.value.trim(),
    coverUrl:      formCoverUrl.value.trim(),
    available:     formAvailable.checked,
  };
}

function updateCoverPreview(url) {
  if (url && url.trim()) {
    coverPreview.src = url.trim();
    coverPreview.classList.add("visible");
  } else {
    coverPreview.src = "";
    coverPreview.classList.remove("visible");
  }
}

// Save handler
async function handleSave() {
  const data = getFormData();

  if (!data.title) { formTitle.focus(); toastError("Title is required"); return; }
  if (!data.author) { formAuthor.focus(); toastError("Author is required"); return; }

  saveBtn.disabled = true;
  saveBtnText.innerHTML = '<span class="spinner"></span>';

  try {
    if (editingId === null) {
      const newBook = await createBook(data);
      allBooks.push(newBook);
      updateStats();
      applyFilter();
      closeModal();
      toastSuccess(`"${newBook.title}" added to your library!`);
    } else {
      const updated = await updateBook(editingId, data);
      const idx = allBooks.findIndex(b => b.id === editingId);
      if (idx >= 0) allBooks[idx] = updated;
      updateStats();
      applyFilter();
      closeModal();
      toastSuccess(`"${updated.title}" updated successfully!`);
    }
  } catch (err) {
    toastError(`Error: ${err.message}`);
  } finally {
    saveBtn.disabled = false;
    saveBtnText.textContent = editingId === null ? "Save Book" : "Update Book";
  }
}

// ── Delete confirm ────────────────────────────────────────────────────────────
function openDeleteConfirm(book) {
  pendingDeleteId = book.id;
  document.getElementById("delete-sub").textContent =
    `Delete "${book.title}"? This action cannot be undone.`;
  deleteOverlay.classList.add("open");
}

function closeDeleteConfirm() {
  deleteOverlay.classList.remove("open");
  pendingDeleteId = null;
}

async function handleDelete() {
  if (!pendingDeleteId) return;

  const id = pendingDeleteId;
  closeDeleteConfirm();

  try {
    await deleteBook(id);
    const removed = allBooks.find(b => b.id === id);
    allBooks = allBooks.filter(b => b.id !== id);
    updateStats();
    applyFilter();
    if (removed) toastSuccess(`"${removed.title}" removed from the library.`);
  } catch (err) {
    toastError(`Delete failed: ${err.message}`);
  }
}

// ── Open Library API ──────────────────────────────────────────────────────────
async function searchOpenLibrary(query) {
  if (!query.trim()) return;

  olResults.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:6px 4px">🔄 Searching Open Library…</div>`;
  document.getElementById("ol-search-btn").disabled = true;

  try {
    const q = encodeURIComponent(query.trim());
    const url = `https://openlibrary.org/search.json?q=${q}&limit=8&fields=key,title,author_name,isbn,first_publish_year,description,cover_i`;
    const resp = await fetch(url, {
      headers: { "User-Agent": "LibraryOS-gRPC-Demo (dev@example.com)" }
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    olResults.innerHTML = "";

    if (!data.docs || data.docs.length === 0) {
      olResults.innerHTML = `<div style="color:var(--text-muted);font-size:13px;padding:6px 4px">No results found.</div>`;
      return;
    }

    data.docs.forEach(doc => {
      const title  = doc.title || "";
      const author = (doc.author_name && doc.author_name[0]) || "";
      const isbn   = (doc.isbn && doc.isbn[0]) || "";
      const year   = doc.first_publish_year || 0;
      const coverId = doc.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
        : (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg` : "");

      const item = document.createElement("div");
      item.className = "ol-result-item";
      item.innerHTML = `
        ${coverUrl
          ? `<img class="ol-result-cover" src="${escapeAttr(coverUrl)}" alt="" loading="lazy" />`
          : `<div class="ol-result-cover" style="background:var(--bg-card);border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--text-muted)">📚</div>`
        }
        <div class="ol-result-info">
          <div class="ol-result-title">${escapeHtml(title)}</div>
          <div class="ol-result-author">${escapeHtml(author)}${year ? ` · ${year}` : ""}</div>
        </div>
      `;

      item.addEventListener("click", () => {
        formTitle.value  = title;
        formAuthor.value = author;
        formIsbn.value   = isbn;
        formYear.value   = year || "";

        // Try to get a large cover
        const largeCover = coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
          : (isbn ? `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg` : "");
        formCoverUrl.value = largeCover;
        updateCoverPreview(largeCover);

        olResults.innerHTML = `<div style="color:var(--accent-success);font-size:13px;padding:6px 4px">✅ Fields filled! You can still edit them below.</div>`;
        toastInfo(`"${title}" imported from Open Library`);
      });

      olResults.appendChild(item);
    });

  } catch (err) {
    olResults.innerHTML = `<div style="color:var(--accent-danger);font-size:13px;padding:6px 4px">⚠️ Search failed: ${escapeHtml(err.message)}</div>`;
  } finally {
    document.getElementById("ol-search-btn").disabled = false;
  }
}

// ── Event listeners ───────────────────────────────────────────────────────────

// Open modal
document.getElementById("add-book-btn").addEventListener("click", openCreateModal);
document.getElementById("fab").addEventListener("click", openCreateModal);

// Close modal
document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-cancel").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

// Save
saveBtn.addEventListener("click", handleSave);

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (deleteOverlay.classList.contains("open")) closeDeleteConfirm();
    else if (modalOverlay.classList.contains("open")) closeModal();
  }
});

// Delete confirm
document.getElementById("delete-cancel").addEventListener("click", closeDeleteConfirm);
document.getElementById("delete-confirm").addEventListener("click", handleDelete);
deleteOverlay.addEventListener("click", (e) => { if (e.target === deleteOverlay) closeDeleteConfirm(); });

// Search
document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  applyFilter();
});

// Filters
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

// Cover URL preview
formCoverUrl.addEventListener("input", (e) => updateCoverPreview(e.target.value));

// Open Library search
document.getElementById("ol-search-btn").addEventListener("click", () => {
  searchOpenLibrary(olSearchInput.value);
});

olSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchOpenLibrary(olSearchInput.value);
});

// ── Boot ──────────────────────────────────────────────────────────────────────
loadBooks();
