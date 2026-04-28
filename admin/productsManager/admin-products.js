document.addEventListener("DOMContentLoaded", () => {
  // تهيئة Firebase
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

  // عناصر DOM
  const productsGrid = document.getElementById('productsGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let products = [];

  // جلب المنتجات من Firebase
  function fetchProducts() {
    database.ref('products').on('value', (snapshot) => {
      products = [];
      snapshot.forEach((childSnapshot) => {
        products.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
          // ضمان وجود حقل التوفر
          availability: childSnapshot.val().availability || 'available'
        });
      });
      
      // ترتيب المنتجات حسب الأحدث
      products.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      displayProducts();
    });
  }

  // عرض المنتجات
  function displayProducts(status = 'all') {
    productsGrid.innerHTML = '';

    const filteredProducts = status === 'all' 
      ? products 
      : products.filter(product => {
          if (status === 'available') return product.availability === 'available';
          if (status === 'out_of_stock') return product.availability === 'out_of_stock';
          return true;
        });

    filteredProducts.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
  }

  // إنشاء بطاقة منتج
  function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = `product-card ${product.availability}`;
    productCard.setAttribute('data-id', product.id);

    const stars = "★★★★★☆☆☆☆☆".slice(5 - product.rating, 10 - product.rating);
    const isAvailable = product.availability === 'available';

    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="availability-badge ${isAvailable ? 'available' : 'out-of-stock'}">
          ${isAvailable ? 'متاح' : 'غير متاح'}
        </span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="stars">${stars}</div>
        <p class="price">${product.price} ج.م</p>
        <p class="category">${translateCategory(product.category)}</p>
      </div>
      <div class="product-actions">
        <button class="action-btn view-btn" data-id="${product.id}">
          <i class="fas fa-eye"></i> عرض
        </button>
        <button class="action-btn ${isAvailable ? 'stock-btn' : 'available-btn'}" data-id="${product.id}">
          <i class="fas ${isAvailable ? 'fa-times' : 'fa-check'}"></i> 
          ${isAvailable ? 'غير متاح' : 'متاح'}
        </button>
        <button class="action-btn delete-btn" data-id="${product.id}">
          <i class="fas fa-trash"></i> حذف
        </button>
      </div>
    `;

    return productCard;
  }

  // ترجمة الفئة للعربية
  function translateCategory(category) {
    const categories = {
      'dress': 'فساتين',
      'bag': 'حقائب',
      'accessory': 'إكسسوارات'
    };
    return categories[category] || category;
  }

  // أحداث الفلترة
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayProducts(btn.dataset.status);
    });
  });

  // معالجة أحداث المنتجات
  document.addEventListener('click', (e) => {
    const productId = e.target.closest('.action-btn')?.dataset.id;
    if (!productId) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (e.target.closest('.view-btn')) {
      showProductDetails(product);
    } 
    else if (e.target.closest('.stock-btn') || e.target.closest('.available-btn')) {
      toggleProductAvailability(productId, product.availability);
    } 
    else if (e.target.closest('.delete-btn')) {
      deleteProduct(productId);
    }
  });

  // عرض تفاصيل المنتج
  function showProductDetails(product) {
    const modal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');

    const date = new Date(product.createdAt || Date.now());
    const formattedDate = date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const galleryImages = product.images.map(img => `
      <img src="${img}" alt="${product.name}" class="product-gallery-img">
    `).join('');

    productDetails.innerHTML = `
      <h2>${product.name}</h2>
      <div class="product-detail-row">
        <div class="product-main-image">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-meta">
          <p><strong>السعر:</strong> ${product.price} ج.م</p>
          <p><strong>التقييم:</strong> ${"★".repeat(product.rating)}${"☆".repeat(5 - product.rating)}</p>
          <p><strong>الفئة:</strong> ${translateCategory(product.category)}</p>
          <p><strong>الحالة:</strong> 
            <span class="availability-badge ${product.availability === 'available' ? 'available' : 'out-of-stock'}">
              ${product.availability === 'available' ? 'متاح' : 'غير متاح'}
            </span>
          </p>
          <p><strong>تاريخ الإضافة:</strong> ${formattedDate}</p>
        </div>
      </div>
      
      <div class="product-gallery">
        <h3>معرض الصور</h3>
        <div class="gallery-grid">${galleryImages}</div>
      </div>
      
      <div class="edit-product-form">
        <h3>تعديل المنتج</h3>
        <div class="form-group">
          <label for="editPrice">السعر (ج.م)</label>
          <input type="text" id="editPrice" value="${product.price.replace('ج.م', '').trim()}">
        </div>
        <div class="form-group">
          <label for="editRating">التقييم (1-5)</label>
          <input type="number" id="editRating" min="1" max="5" value="${product.rating}">
        </div>
        <div class="form-group">
          <label for="editAvailability">الحالة</label>
          <select id="editAvailability">
            <option value="available" ${product.availability === 'available' ? 'selected' : ''}>متاح</option>
            <option value="out_of_stock" ${product.availability === 'out_of_stock' ? 'selected' : ''}>غير متاح</option>
          </select>
        </div>
        <button class="save-btn" data-id="${product.id}">حفظ التعديلات</button>
      </div>
    `;

    // حدث حفظ التعديلات
    document.querySelector('.save-btn').addEventListener('click', () => {
      updateProduct(product.id);
    });

    modal.style.display = 'block';
  }

  // تبديل حالة التوفر
  function toggleProductAvailability(productId, currentAvailability) {
    const newAvailability = currentAvailability === 'available' ? 'out_of_stock' : 'available';
    updateProductField(productId, 'availability', newAvailability);
  }

  // تحديث حقل معين في المنتج
  function updateProductField(productId, field, value) {
    database.ref(`products/${productId}/${field}`).set(value)
      .then(() => {
        showToast(`تم تحديث ${field === 'availability' ? 'حالة التوفر' : field}`, 'success');
      })
      .catch(error => {
        console.error('Error updating product:', error);
        showToast('حدث خطأ أثناء التحديث', 'error');
      });
  }

  // تحديث المنتج بالكامل
  function updateProduct(productId) {
    const price = document.getElementById('editPrice').value + ' ج.م';
    const rating = parseInt(document.getElementById('editRating').value);
    const availability = document.getElementById('editAvailability').value;

    const updates = {
      price,
      rating,
      availability
    };

    database.ref(`products/${productId}`).update(updates)
      .then(() => {
        showToast('تم تحديث المنتج بنجاح', 'success');
        document.getElementById('productModal').style.display = 'none';
      })
      .catch(error => {
        console.error('Error updating product:', error);
        showToast('حدث خطأ أثناء تحديث المنتج', 'error');
      });
  }

  // حذف المنتج
  function deleteProduct(productId) {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية')) {
      database.ref(`products/${productId}`).remove()
        .then(() => {
          showToast('تم حذف المنتج بنجاح', 'success');
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          showToast('حدث خطأ أثناء حذف المنتج', 'error');
        });
    }
  }

  // إغلاق المودال
  document.querySelector('#productModal .close-btn').addEventListener('click', () => {
    document.getElementById('productModal').style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) {
      document.getElementById('productModal').style.display = 'none';
    }
  });

  // رسائل التنبيه
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
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

  // بدء جلب المنتجات
  fetchProducts();
});