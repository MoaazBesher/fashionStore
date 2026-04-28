document.addEventListener("DOMContentLoaded", () => {
  // ==================== VARIABLES ====================
  const productsSection = document.getElementById("products");
  let visibleCount = 6;
  let filteredCategory = "all";
  let filteredBySearch = [];
  let allProducts = [];
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // ==================== IMAGE FALLBACK FUNCTION ====================
  window.handleImageFallback = function(img) {
    const currentIndex = parseInt(img.getAttribute('data-current-index')) || 0;
    let images = [];
    try {
      images = JSON.parse(img.getAttribute('data-images')) || [];
    } catch(e) {
      images = [img.src];
    }
    
    if (!images || images.length === 0) {
      img.src = 'https://placehold.co/400x400/e91e63/ffffff?text=No+Image';
      return;
    }
    
    // Try next image in gallery
    const nextIndex = currentIndex + 1;
    if (nextIndex < images.length) {
      img.setAttribute('data-current-index', nextIndex);
      img.src = images[nextIndex];
    } else {
      // All images failed, show placeholder
      img.src = 'https://placehold.co/400x400/e91e63/ffffff?text=No+Image';
    }
  };

  // ==================== FIREBASE ====================
  const firebaseConfig = {
    apiKey: "AIzaSyCbv5agQov4LyezPbWM_XC8qk8bkbh8EX8",
    authDomain: "market-products-d3b84.firebaseapp.com",
    databaseURL: "https://market-products-d3b84-default-rtdb.firebaseio.com",
    projectId: "market-products-d3b84",
    storageBucket: "market-products-d3b84.appspot.com",
    messagingSenderId: "383604293089",
    appId: "1:383604293089:web:a59e21488df2f0bdbfe6a0",
    measurementId: "G-HK5H94NJZG"
  };

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  // ==================== INITIALIZE ====================
  initSearch();
  initWishlist();
  initAuthUI();
  checkForProductParam();

  function checkForProductParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    if (productId) {
      loadProductAndOpenModal(productId);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  async function loadProductAndOpenModal(productId) {
    try {
      const snapshot = await database.ref('products').child(productId).once('value');
      const product = snapshot.val();
      if (product) {
        openModal({ id: productId, ...product });
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
  }
  setupCartEvents();
  updateCartUI();
  fetchProducts();
  hideLoader();

  // ==================== FUNCTIONS ====================

  function hideLoader() {
    const loader = document.getElementById("loader");
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => loader.style.display = 'none', 500);
    }, 1200);
  }

  function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const navbarSearch = document.getElementById('navbarSearch');
    const searchInput = document.getElementById('searchInput');
    
    // Toggle search bar on mobile
    if (searchToggle && navbarSearch) {
      searchToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navbarSearch.classList.toggle('active');
        if (navbarSearch.classList.contains('active')) {
          searchInput.focus();
        }
      });
      
      // Close when clicking outside
      document.addEventListener('click', (e) => {
        if (navbarSearch.classList.contains('active') && 
            !navbarSearch.contains(e.target) && 
            !searchToggle.contains(e.target)) {
          navbarSearch.classList.remove('active');
        }
      });
    }
    
    // Search functionality
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filteredBySearch = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        displayProducts(6);
      });
    }
  }

  function initWishlist() {
    const wishlistToggle = document.getElementById('wishlistToggle');
    const profileLink = document.getElementById('profileLink');
    const profileDropdown = document.getElementById('profileDropdown');
    const dropdownUserName = document.getElementById('dropdownUserName');
    const dropdownSignOut = document.getElementById('dropdownSignOut');
    const auth = firebase.auth();
    
    if (wishlistToggle) {
      wishlistToggle.addEventListener('click', () => {
        showWishlistModal();
      });
    }

    // Toggle dropdown on profile click
    if (profileLink && profileDropdown) {
      profileLink.addEventListener('click', (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle('show');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (profileDropdown.classList.contains('show') && 
            !profileDropdown.contains(e.target) && 
            !profileLink.contains(e.target)) {
          profileDropdown.classList.remove('show');
        }
      });

      // Update user name in dropdown
      auth.onAuthStateChanged(user => {
        if (user && dropdownUserName) {
          dropdownUserName.textContent = user.displayName || user.email.split('@')[0];
        }
      });

      // Handle sign out from dropdown
      if (dropdownSignOut) {
        dropdownSignOut.addEventListener('click', () => {
          auth.signOut();
          if (profileDropdown) {
            profileDropdown.classList.remove('show');
          }
          showToast('Signed out successfully', 'info');
        });
      }
    }
  }

  function fetchProducts() {
    database.ref('products').on('value', (snapshot) => {
      const products = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      allProducts = products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      filteredBySearch = [...allProducts];
      displayProducts(visibleCount);
      updateWishlistButtons(); // Update wishlist status after products load
    }, (error) => {
      console.error("Error fetching products:", error);
      document.getElementById("noResults").textContent = "Failed to load products. Please try again later.";
      document.getElementById("noResults").style.display = "block";
    });
  }

  function displayProducts(count) {
    productsSection.innerHTML = "";
    
    const filteredProducts = filteredCategory === "all" 
      ? filteredBySearch 
      : filteredBySearch.filter(p => p.category === filteredCategory);

    if (filteredProducts.length === 0) {
      document.getElementById("noResults").style.display = "block";
      document.querySelector(".show-more-container").style.display = "none";
      return;
    } else {
      document.getElementById("noResults").style.display = "none";
    }

    const productsToShow = filteredProducts.slice(0, count);
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    productsToShow.forEach((product, index) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product-card");
      productDiv.style.animationDelay = `${index * 0.1}s`;
      
      const isAvailable = product.availability !== 'out_of_stock';
      const outOfStockBadge = !isAvailable ? `
        <div class="out-of-stock-badge">
          <span>Out of Stock</span>
        </div>
      ` : '';

      const rating = product.rating || 4;
      const safeRating = Math.max(0, Math.min(5, rating));
      const stars = "★".repeat(safeRating) + "☆".repeat(5 - safeRating);
      
      // Get all images for this product
      const productGallery = (product.images && product.images.length > 0) 
        ? product.images 
        : [product.image];
      
      // Check if in wishlist
      const inWishlist = wishlist.some(item => item.id === product.id);
      const heartClass = inWishlist ? 'fas fa-heart wishlisted' : 'far fa-heart';
      
      productDiv.innerHTML = `
        <div class="product-image">
          <img src="${productGallery[0]}" 
               alt="${product.name}" 
               loading="lazy" 
               data-images='${JSON.stringify(productGallery)}'
               data-current-index="0"
               onerror="handleImageFallback(this)"/>
          ${!isAvailable ? outOfStockBadge : ''}
          <button class="product-wishlist ${inWishlist ? 'active' : ''}" data-id="${product.id}">
            <i class="${heartClass}"></i>
          </button>
          ${inWishlist ? '<span class="wishlist-badge">Wishlisted</span>' : ''}
        </div>
        <div class="product-info">
          <span class="product-category">${product.category || 'General'}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-rating">
            <div class="stars">
              ${stars.split('').map(s => `<i class="fas fa-star" style="color: ${s === '★' ? '#ffc107' : '#e0e0e0'}"></i>`).join('')}
            </div>
            <span class="rating-count">(${product.rating || 5})</span>
          </div>
          <div class="product-price">
            <span class="price-current">${product.price}</span>
          </div>
        </div>
        <div class="product-actions-card">
          <button class="btn-add-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn-quick-view" data-id="${product.id}">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      `;

      // Click event for product card
      productDiv.addEventListener("click", (e) => {
        if (e.target.closest('.product-wishlist') || e.target.closest('.btn-add-cart') || e.target.closest('.btn-quick-view')) {
          return;
        }
        if (isAvailable) {
          openModal(product);
        } else {
          showToast("This product is currently unavailable", "error");
        }
      });

      // Wishlist button
      productDiv.querySelector('.product-wishlist').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
      });

      // Add to cart button
      productDiv.querySelector('.btn-add-cart').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAvailable) {
          addToCart(product);
        } else {
          showToast("This product is currently unavailable", "error");
        }
      });

      // Quick view button
      productDiv.querySelector('.btn-quick-view').addEventListener('click', (e) => {
        e.stopPropagation();
        if (isAvailable) {
          openModal(product);
        } else {
          showToast("This product is currently unavailable", "error");
        }
      });

      productsSection.appendChild(productDiv);
    });

    document.querySelector(".show-more-container").style.display =
      visibleCount >= filteredProducts.length ? "none" : "block";
  }

  function openModal(product) {
    const modal = document.getElementById("productModal");
    const modalDetails = document.getElementById("modalDetails");
    const mainModalImg = document.getElementById("mainModalImg");
    const modalThumbnails = document.getElementById("modalThumbnails");

    // Get images from product or use single image
    let productImages = (product.images && product.images.length > 0) 
      ? product.images 
      : [product.image];
    
    if (!productImages || productImages.length === 0) {
      productImages = [product.image];
    }
    
    if (mainModalImg) {
      mainModalImg.setAttribute('data-images', JSON.stringify(productImages));
      mainModalImg.setAttribute('data-current-index', '0');
      mainModalImg.src = productImages[0];
      mainModalImg.onerror = function() {
        window.handleImageFallback(this);
      };
    }

    if (modalThumbnails) {
      modalThumbnails.innerHTML = productImages.map((img, idx) => `
        <img src="${img}" 
             alt="Thumbnail ${idx + 1}" 
             class="${idx === 0 ? 'active' : ''}" 
             data-index="${idx}"
             onerror="this.onerror = null; this.src = 'https://placehold.co/400x400/e91e63/ffffff?text=No+Image'"/>
      `).join('');
      
      // Add click handlers for thumbnails
      modalThumbnails.querySelectorAll('img').forEach(thumb => {
        thumb.addEventListener('click', () => {
          modalThumbnails.querySelectorAll('img').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          mainModalImg.src = thumb.src;
        });
      });
    }

    const modalStars = product.rating || 4;
    const safeModalRating = Math.max(0, Math.min(5, modalStars));
    const stars = "★".repeat(safeModalRating) + "☆".repeat(5 - safeModalRating);

    modalDetails.innerHTML = `
      <span class="modal-category">${product.category || 'General'}</span>
      <h2 class="modal-title">${product.name}</h2>
      <div class="modal-rating">
        <div class="stars">
          ${stars.split('').map(s => `<i class="fas fa-star" style="color: ${s === '★' ? '#ffc107' : '#e0e0e0'}"></i>`).join('')}
        </div>
        <span>(${product.rating || 5} rating)</span>
      </div>
      <p class="modal-description">${product.description || 'Premium quality product designed for your elegance and style.'}</p>
      <div class="modal-price">
        <span class="modal-price-current">${product.price}</span>
      </div>
      <div class="modal-quantity">
        <span class="quantity-label">Quantity:</span>
        <div class="quantity-controls">
          <button class="qty-minus"><i class="fas fa-minus"></i></button>
          <span class="quantity-display">1</span>
          <button class="qty-plus"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn-modal-cart" data-id="${product.id}">
          <i class="fas fa-shopping-cart"></i> Add to Cart
        </button>
        <button class="btn-modal-buy" data-id="${product.id}">
          <i class="fas fa-bolt"></i> Buy Now
        </button>
      </div>
    `;

    // Thumbnail click
    modalThumbnails.querySelectorAll('img').forEach(thumb => {
      thumb.addEventListener('click', () => {
        modalThumbnails.querySelectorAll('img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainModalImg.src = thumb.src;
      });
    });

    // Quantity controls
    let quantity = 1;
    const qtyDisplay = modalDetails.querySelector('.quantity-display');
    const qtyMinus = modalDetails.querySelector('.qty-minus');
    const qtyPlus = modalDetails.querySelector('.qty-plus');

    qtyMinus.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        qtyDisplay.textContent = quantity;
      }
    });

    qtyPlus.addEventListener('click', () => {
      quantity++;
      qtyDisplay.textContent = quantity;
    });

    // Add to cart
    modalDetails.querySelector('.btn-modal-cart').addEventListener('click', () => {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      modal.style.display = 'none';
    });

    // Buy now
    modalDetails.querySelector('.btn-modal-buy').addEventListener('click', () => {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      modal.style.display = 'none';
      showCartModal();
    });

    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function initAuthUI() {
    const auth = firebase.auth();
    const signInBtn = document.getElementById('signInBtn');
    const profileLink = document.getElementById('profileLink');
    
    // Handle sign in button click
    if (signInBtn) {
      signInBtn.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
          .then(result => {
            showToast('Signed in successfully!', 'success');
          })
          .catch(error => {
            showToast("Error: " + error.message, "error");
          });
      });
    }

    // Listen for auth changes - update both buttons
    auth.onAuthStateChanged(user => {
      if (signInBtn) {
        signInBtn.style.display = user ? 'none' : 'flex';
      }
      if (profileLink) {
        profileLink.style.display = user ? 'flex' : 'none';
      }
      if (user) {
        showToast('Welcome ' + (user.displayName || 'back!'), 'success');
      }
    });
  }

  function setupCartEvents() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');

    // Open cart
    cartIcon.addEventListener('click', () => {
      showCartModal();
      updateCartTotal();
    });

    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
          modal.style.display = 'none';
        });
        document.body.style.overflow = '';
      });
    });

    // Close on overlay click
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });

    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', () => {
      proceedToCheckout();
    });

    // Handle cart item actions
    document.addEventListener('click', handleCartActions);
  }

  function handleCartActions(e) {
    const target = e.target;
    const isPlusBtn = target.classList.contains('plus') || target.closest('.plus');
    const isMinusBtn = target.classList.contains('minus') || target.closest('.minus');
    const isRemoveBtn = target.classList.contains('cart-item-remove') || target.closest('.cart-item-remove');
    const isCheckoutBtn = target.id === 'checkoutBtn';

    if (!isPlusBtn && !isMinusBtn && !isRemoveBtn && !isCheckoutBtn) return;

    if (isCheckoutBtn) return;

    const cartItemEl = target.closest('.cart-item');
    if (!cartItemEl) return;

    const itemId = cartItemEl.dataset.id;
    if (!itemId) return;

    const updatedCart = [...cart];
    const cartItem = updatedCart.find(item => item.id === itemId);
    if (!cartItem) return;

    if (isPlusBtn) {
      cartItem.quantity += 1;
      showToast(`Increased ${cartItem.name} quantity`, 'success');
    } else if (isMinusBtn) {
      if (cartItem.quantity > 1) {
        cartItem.quantity -= 1;
        showToast(`Decreased ${cartItem.name} quantity`, 'success');
      } else {
        updatedCart.splice(updatedCart.indexOf(cartItem), 1);
        showToast(`${cartItem.name} removed from cart`, 'info');
      }
    } else if (isRemoveBtn) {
      updatedCart.splice(updatedCart.indexOf(cartItem), 1);
      showToast(`${cartItem.name} removed from cart`, 'info');
    }

    cart = updatedCart;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    
    // Update cart total when modal is open
    if (document.getElementById('cartModal').style.display === 'block') {
      showCartModal();
    } else {
      // Update just the total without reopening modal
      updateCartTotal();
    }
  }

  function updateCartTotal() {
    const totalEl = document.getElementById('cartTotal');
    if (!totalEl) return;
    
    if (cart.length === 0) {
      totalEl.textContent = '$0.00';
      const checkoutBtn = document.getElementById('checkoutBtn');
      if (checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '').replace('ج.م', '').replace('LE', '').replace('E£', '').trim()) || 0;
        return sum + (price * item.quantity);
      }, 0);
      totalEl.textContent = `$${total.toFixed(2)}`;
    }
  }

  function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems > 0 ? totalItems : '';
      
      if (totalItems > 0) {
        cartCount.classList.add('animate');
        setTimeout(() => cartCount.classList.remove('animate'), 300);
      }
    }
  }

  function addToCart(product) {
    if (product.availability === 'out_of_stock') {
      showToast("This product is currently unavailable", "error");
      return;
    }
    
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex > -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Cart save error:', e);
    }
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems > 0 ? totalItems : '';
      
      if (totalItems > 0) {
        cartCount.classList.add('animate');
        setTimeout(() => cartCount.classList.remove('animate'), 300);
      }
    }
    
    showToast(`${product.name} added to cart!`, 'success');
  }

  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  function toggleWishlist(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex > -1) {
      wishlist.splice(existingIndex, 1);
      showToast('Removed from wishlist', 'info');
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
      showToast('Added to wishlist!', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Update all wishlist buttons on page
    updateWishlistButtons();
  }
  
  function updateWishlistButtons() {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelectorAll('.product-wishlist').forEach(btn => {
      const productId = btn.dataset.id;
      const inWishlist = wishlist.some(item => item.id === productId);
      btn.classList.toggle('active', inWishlist);
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = inWishlist ? 'fas fa-heart wishlisted' : 'far fa-heart';
      }
    });
    
    // Update wishlist badge if exists on card
    document.querySelectorAll('.product-card').forEach(card => {
      const btn = card.querySelector('.product-wishlist');
      const productId = btn ? btn.dataset.id : null;
      if (productId) {
        const inWishlist = wishlist.some(item => item.id === productId);
        let badge = card.querySelector('.wishlist-badge');
        if (inWishlist && !badge) {
          badge = document.createElement('span');
          badge.className = 'wishlist-badge';
          badge.textContent = 'Wishlisted';
          card.querySelector('.product-image').appendChild(badge);
        } else if (!inWishlist && badge) {
          badge.remove();
        }
      }
    });
  }

  function showWishlistModal() {
    const modal = document.getElementById('wishlistModal');
    const wishlistItems = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
      wishlistItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-heart"></i>
          <p>Your wishlist is empty</p>
        </div>
      `;
    } else {
      const handleImageError = `this.src='https://placehold.co/400x400/e91e63/ffffff?text=No+Image'`;
      wishlistItems.innerHTML = wishlist.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="${handleImageError}">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">${item.price}</p>
          </div>
          <div class="cart-item-controls">
            <button class="cart-item-remove" onclick="removeFromWishlist('${item.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    showWishlistModal();
    showToast('Removed from wishlist', 'info');
  }

  function closeWishlistModal() {
    document.getElementById('wishlistModal').style.display = 'none';
    document.body.style.overflow = '';
  }

  function showCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      document.getElementById('checkoutBtn').style.display = 'none';
      document.getElementById('cartTotal').textContent = '$0.00';
    } else {
      cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">${item.price}</p>
          </div>
          <div class="cart-item-controls">
            <div class="cart-item-quantity">
              <button class="quantity-btn minus" data-id="${item.id}">
                <i class="fas fa-minus"></i>
              </button>
              <span>${item.quantity}</span>
              <button class="quantity-btn plus" data-id="${item.id}">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');

      const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('$', '').replace('ج.م', '').replace('LE', '').replace('E£', '').trim()) || 0;
        return sum + (price * item.quantity);
      }, 0);

      document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
      document.getElementById('checkoutBtn').style.display = 'block';
    }

    cartModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function proceedToCheckout() {
    const user = firebase.auth().currentUser;
    document.getElementById('cartModal').style.display = 'none';

    if (!user) {
      // Open sign in modal instead
      openSignInModal();
      return;
    }
    
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }
    
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Pre-fill user data from auth and Firebase
    if (user.displayName) {
      document.getElementById('fullName').value = user.displayName;
    }
    document.getElementById('email').value = user.email;
    
    // Load saved profile data
    firebase.database().ref('users/' + user.uid).once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        if (data.name && !document.getElementById('fullName').value) {
          document.getElementById('fullName').value = data.name;
        }
        if (data.phone) {
          document.getElementById('phone').value = data.phone;
        }
        if (data.address) {
          if (data.address.city) document.getElementById('governorate').value = data.address.city;
          if (data.address.street) document.getElementById('address').value = data.address.street;
          if (data.address.area) document.getElementById('address').value += ', ' + data.address.area;
          if (data.address.instructions && !document.getElementById('notes').value) {
            document.getElementById('notes').value = data.address.instructions;
          }
        }
      }
    });
  }

  function openSignInModal() {
    const modal = document.getElementById('signInModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeSignInModal() {
    const modal = document.getElementById('signInModal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Close sign in modal on close button click
  document.addEventListener('click', function(e) {
    if (e.target.closest('.modal-close') && e.target.closest('#signInModal')) {
      closeSignInModal();
    }
  });

  // Form submission
  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = firebase.auth().currentUser;
    if (!user) {
      showToast('Please sign in first', 'error');
      return;
    }

    const formData = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      governorate: document.getElementById('governorate').value,
      address: document.getElementById('address').value.trim(),
      paymentMethod: document.getElementById('paymentMethod').value,
      notes: document.getElementById('notes').value.trim(),
      cartItems: cart,
      total: calculateTotal(),
      userId: user.uid,
      userEmail: user.email,
      status: 'new',
      createdAt: firebase.database.ServerValue.TIMESTAMP
    };
    
    if (!validateCheckoutForm(formData)) {
      return;
    }
    
    try {
      await database.ref('orders').push(formData);
      
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartUI();
      
      document.getElementById('checkoutModal').style.display = 'none';
      document.getElementById('checkoutForm').reset();
      
      showToast('Order placed successfully! Thank you for your purchase.', 'success');
    } catch (error) {
      console.error('Error submitting order:', error);
      showToast('Error placing order. Please try again.', 'error');
    }
  });

  function calculateTotal() {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace('$', '').replace('ج.م', '').replace('LE', '').replace('E£', '').trim()) || 0;
      return sum + (price * item.quantity);
    }, 0);
  }

  function validateCheckoutForm(formData) {
    if (!formData.fullName || formData.fullName.length < 3) {
      showToast('Name must be at least 3 characters', 'error');
      return false;
    }
    
    if (!formData.phone || !/^01[0-9]{9}$/.test(formData.phone)) {
      showToast('Phone must start with 01 and be 11 digits', 'error');
      return false;
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast('Invalid email address', 'error');
      return false;
    }
    
    if (!formData.governorate) {
      showToast('Please select a governorate', 'error');
      return false;
    }
    
    if (!formData.address || formData.address.length < 10) {
      showToast('Address must be at least 10 characters', 'error');
      return false;
    }
    
    return true;
  }

  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }, 100);
  }

  // ==================== EVENTS ====================

  // Show more
  document.getElementById("showMoreBtn").addEventListener("click", () => {
    visibleCount += 4;
    displayProducts(visibleCount);
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".filter-btn.active").classList.remove("active");
      btn.classList.add("active");
      filteredCategory = btn.getAttribute("data-category");
      visibleCount = 6;
      displayProducts(visibleCount);
    });
  });

  // Search
  document.getElementById("searchInput").addEventListener("input", e => {
    const searchTerm = e.target.value.toLowerCase();
    filteredBySearch = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    visibleCount = 6;
    displayProducts(visibleCount);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (modal.style.display === 'block') {
          modal.style.display = 'none';
        }
      });
      document.getElementById('searchBar').classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});