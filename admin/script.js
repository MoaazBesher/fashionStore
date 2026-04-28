document.addEventListener("DOMContentLoaded", () => {
  const productsSection = document.getElementById("products");
  let visibleCount = 4;
  let filteredCategory = "all";
  let filteredBySearch = [];

  // ✅ المنتجات الأساسية
  const allProducts = [
    {
      name: "Elegant Pink Dress",
      price: "$49.99",
      category: "dress",
      rating: 4,
      image: "images/dress1.jpg",
      images: ["images/dress1.jpg", "images/dress1_alt1.jpg", "images/dress1_alt2.jpg"]
    },
    {
      name: "Classic Black Bag",
      price: "$39.99",
      category: "bag",
      rating: 5,
      image: "images/bag1.jpg",
      images: ["images/bag1.jpg", "images/bag1_alt1.jpg", "images/bag1_alt2.jpg"]
    },
    {
      name: "Golden Necklace",
      price: "$19.99",
      category: "accessory",
      rating: 3,
      image: "images/accessory1.jpg",
      images: ["images/accessory1.jpg", "images/accessory1_alt1.jpg"]
    },
    {
      name: "Summer Floral Dress",
      price: "$59.99",
      category: "dress",
      rating: 4,
      image: "images/dress2.jpg",
      images: ["images/dress2.jpg", "images/dress2_alt1.jpg"]
    },
    // ✅ ممكن تضيف هنا منتجات تانية ثابتة
  ];

  // ✅ إضافة المنتجات اللي الأدمن ضافها من LocalStorage
  const storedProducts = JSON.parse(localStorage.getItem("newProducts")) || [];
  allProducts.push(...storedProducts);

  filteredBySearch = [...allProducts];

  function displayProducts(count) {
    productsSection.innerHTML = "";
    const filteredProducts =
      filteredCategory === "all"
        ? filteredBySearch
        : filteredBySearch.filter((p) => p.category === filteredCategory);

    if (filteredProducts.length === 0) {
      document.getElementById("noResults").style.display = "block";
      document.querySelector(".show-more-container").style.display = "none";
      return;
    } else {
      document.getElementById("noResults").style.display = "none";
    }

    const productsToShow = filteredProducts.slice(0, count);

    productsToShow.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");
      productDiv.setAttribute("data-category", product.category);

      const stars = "★★★★★☆☆☆☆☆".slice(5 - product.rating, 10 - product.rating);

      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy" />
        <h3>${product.name}</h3>
        <div class="stars">${stars}</div>
        <p>${product.price}</p>
      `;

      productDiv.addEventListener("click", () => {
        openModal(product);
      });

      productsSection.appendChild(productDiv);
    });

    document.querySelector(".show-more-container").style.display =
      visibleCount >= filteredProducts.length ? "none" : "block";
  }

  // إضافة هذه الدوال لمشاهدة الطلبات
function loadOrders() {
  database.ref('orders').on('value', (snapshot) => {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    ordersTable.innerHTML = `
      <tr>
        <th>Order ID</th>
        <th>Product</th>
        <th>Customer</th>
        <th>Status</th>
        <th>Date</th>
        <th>Actions</th>
      </tr>
    `;
    
    snapshot.forEach((childSnapshot) => {
      const order = childSnapshot.val();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${childSnapshot.key.substr(0, 6)}</td>
        <td>${order.productName}</td>
        <td>${order.userEmail}</td>
        <td>
          <select class="order-status" data-id="${childSnapshot.key}">
            <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>${new Date(order.createdAt).toLocaleString()}</td>
        <td><button class="delete-order" data-id="${childSnapshot.key}">Delete</button></td>
      `;
      ordersTable.appendChild(row);
    });
  });
}

  document.getElementById("showMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    displayProducts(visibleCount);
  });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      filteredCategory = btn.getAttribute("data-category");
      visibleCount = 4;
      displayProducts(visibleCount);
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredBySearch = allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchTerm)
    );
    visibleCount = 4;
    displayProducts(visibleCount);
  });

  document.getElementById("modeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  const loader = document.getElementById("loader");
  setTimeout(() => (loader.style.display = "none"), 1000);

  // ✅ Modal Logic
  const modal = document.getElementById("productModal");
  const modalCloseBtn = document.querySelector(".close-btn");

  function openModal(product) {
    const modalDetails = document.getElementById("modalDetails");

    const thumbsHtml = product.images
      .map(
        (img, idx) =>
          `<img src="${img}" alt="${product.name} thumbnail ${idx + 1}" class="thumb ${idx === 0 ? "active" : ""}">`
      )
      .join("");

    modalDetails.innerHTML = `
      <h2>${product.name}</h2>
      <div class="modal-images">
        <img src="${product.images[0]}" alt="${product.name}" id="mainModalImg" />
        <div class="thumbnails">${thumbsHtml}</div>
      const adminRating = product.rating || 4;
      const safeAdminRating = Math.max(0, Math.min(5, adminRating));
      </div>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Rating:</strong> ${"★".repeat(safeAdminRating)}${"☆".repeat(5 - safeAdminRating)}</p>
      <button id="addToCartBtn">Add to Cart</button>
    `;

    modal.style.display = "block";

    const thumbs = modalDetails.querySelectorAll(".thumb");
    const mainImg = modalDetails.querySelector("#mainModalImg");
    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => {
        thumbs.forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        mainImg.src = thumb.src;
      });
    });
  }

  modalCloseBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ✅ عرض المنتجات عند بداية الصفحة
  displayProducts(visibleCount);
});
