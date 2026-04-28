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
  const ordersGrid = document.getElementById('ordersGrid');
  const archivedOrdersGrid = document.getElementById('archivedOrdersGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let orders = [];

  // جلب الطلبات من Firebase
  function fetchOrders() {
    database.ref('orders').on('value', (snapshot) => {
      orders = [];
      snapshot.forEach((childSnapshot) => {
        orders.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        });
      });
      
      // ترتيب الطلبات حسب الأحدث
      orders.sort((a, b) => b.createdAt - a.createdAt);
      displayOrders();
    });
  }

  // عرض الطلبات
  function displayOrders(status = 'all') {
    ordersGrid.innerHTML = '';
    archivedOrdersGrid.innerHTML = '';

    const filteredOrders = status === 'all' 
      ? orders 
      : orders.filter(order => order.status === status);

    filteredOrders.forEach(order => {
      const orderCard = createOrderCard(order);
      
      if (order.status === 'ملغي' || order.status === 'مكتمل') {
        archivedOrdersGrid.appendChild(orderCard);
      } else {
        ordersGrid.appendChild(orderCard);
      }
    });
  }

  // إنشاء بطاقة طلب
  function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = `order-card ${order.status.toLowerCase().replace(' ', '-')}`;
    orderCard.setAttribute('data-id', order.id);

    const date = new Date(order.createdAt);
    const formattedDate = date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    orderCard.innerHTML = `
      <div class="order-header">
        <span class="order-id">#${order.id.substr(0, 6)}</span>
        <span class="order-date">${formattedDate}</span>
        <span class="order-status ${getStatusClass(order.status)}">${order.status}</span>
      </div>
      <div class="order-body">
        <p><strong>العميل:</strong> ${order.fullName}</p>
        <p><strong>الهاتف:</strong> ${order.phone}</p>
        <p><strong>المحافظة:</strong> ${order.governorate}</p>
        <p><strong>المجموع:</strong> ${order.total.toFixed(2)} ج.م</p>
      </div>
      <div class="order-actions">
        <button class="action-btn view-btn" data-id="${order.id}">
          <i class="fas fa-eye"></i> التفاصيل
        </button>
        ${order.status !== 'مكتمل' ? `
        <button class="action-btn complete-btn" data-id="${order.id}">
          <i class="fas fa-check"></i> إكمال
        </button>` : ''}
        ${order.status !== 'ملغي' ? `
        <button class="action-btn cancel-btn" data-id="${order.id}">
          <i class="fas fa-times"></i> إلغاء
        </button>` : ''}
        ${order.status === 'ملغي' ? `
        <button class="action-btn delete-btn" data-id="${order.id}">
          <i class="fas fa-trash"></i> حذف نهائي
        </button>` : ''}
      </div>
    `;

    return orderCard;
  }

  // تصنيف حالة الطلب
  function getStatusClass(status) {
    const statusClasses = {
      'جديد': 'new',
      'قيد التجهيز': 'processing',
      'مكتمل': 'completed',
      'ملغي': 'cancelled'
    };
    return statusClasses[status] || '';
  }

  // أحداث الفلترة
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayOrders(btn.dataset.status);
    });
  });

  // معالجة أحداث الطلبات
  document.addEventListener('click', (e) => {
    const orderId = e.target.closest('.action-btn')?.dataset.id;
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (e.target.closest('.view-btn')) {
      showOrderDetails(order);
    } 
    else if (e.target.closest('.complete-btn')) {
      updateOrderStatus(orderId, 'مكتمل');
    } 
    else if (e.target.closest('.cancel-btn')) {
      updateOrderStatus(orderId, 'ملغي');
    } 
    else if (e.target.closest('.delete-btn')) {
      deleteOrderPermanently(orderId);
    }
  });

  // عرض تفاصيل الطلب
  function showOrderDetails(order) {
    const modal = document.getElementById('orderModal');
    const orderDetails = document.getElementById('orderDetails');

    const date = new Date(order.createdAt);
    const formattedDate = date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const itemsHtml = order.cartItems.map(item => `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>${item.price} × ${item.quantity}</p>
        </div>
      </div>
    `).join('');

    orderDetails.innerHTML = `
      <h2>تفاصيل الطلب #${order.id.substr(0, 6)}</h2>
      <div class="order-info">
        <p><strong>تاريخ الطلب:</strong> ${formattedDate}</p>
        <p><strong>حالة الطلب:</strong> <span class="${getStatusClass(order.status)}">${order.status}</span></p>
        <p><strong>طريقة الدفع:</strong> ${order.paymentMethod}</p>
      </div>
      
      <div class="customer-info">
        <h3><i class="fas fa-user"></i> معلومات العميل</h3>
        <p><strong>الاسم:</strong> ${order.fullName}</p>
        <p><strong>الهاتف:</strong> ${order.phone}</p>
        ${order.email ? `<p><strong>البريد الإلكتروني:</strong> ${order.email}</p>` : ''}
        <p><strong>العنوان:</strong> ${order.governorate} - ${order.address}</p>
      </div>
      
      <div class="order-items">
        <h3><i class="fas fa-box-open"></i> المنتجات</h3>
        ${itemsHtml}
      </div>
      
      <div class="order-summary">
        <h3><i class="fas fa-receipt"></i> ملخص الطلب</h3>
        <p><strong>المجموع:</strong> ${order.total.toFixed(2)} ج.م</p>
        ${order.notes ? `<p><strong>ملاحظات:</strong> ${order.notes}</p>` : ''}
      </div>
    `;

    modal.style.display = 'block';
  }

  // تحديث حالة الطلب
  function updateOrderStatus(orderId, newStatus) {
    database.ref(`orders/${orderId}/status`).set(newStatus)
      .then(() => {
        showToast(`تم تحديث حالة الطلب إلى ${newStatus}`, 'success');
      })
      .catch(error => {
        console.error('Error updating order:', error);
        showToast('حدث خطأ أثناء تحديث الطلب', 'error');
      });
  }

  // حذف الطلب نهائياً
  function deleteOrderPermanently(orderId) {
    if (confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) {
      database.ref(`orders/${orderId}`).remove()
        .then(() => {
          showToast('تم حذف الطلب بنجاح', 'success');
        })
        .catch(error => {
          console.error('Error deleting order:', error);
          showToast('حدث خطأ أثناء حذف الطلب', 'error');
        });
    }
  }

  // إغلاق المودال
  document.querySelector('#orderModal .close-btn').addEventListener('click', () => {
    document.getElementById('orderModal').style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('orderModal')) {
      document.getElementById('orderModal').style.display = 'none';
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

  // بدء جلب الطلبات
  fetchOrders();
});