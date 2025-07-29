// بيانات وهمية للكتب
const books = [
    { id: 1, title: "تعلم JavaScript", author: "أحمد محمد", category: "برمجة", available: true },
    { id: 2, title: "التاريخ الإسلامي", author: "علي حسن", category: "تاريخ", available: false },
    { id: 3, title: "الفيزياء الحديثة", author: "سارة عبدالله", category: "علوم", available: true },
    { id: 4, title: "أساسيات HTML و CSS", author: "محمد خالد", category: "ويب", available: true },
    { id: 5, title: "الأدب العربي", author: "فاطمة ناصر", category: "أدب", available: false }
];

// بيانات وهمية للمستخدمين
const users = [
    { id: 101, name: "علي أحمد", email: "ali@hotmail.com", type: "student", password: "123456" },
    { id: 102, name: "سارة محمد", email: "sara@hotmail.com", type: "teacher", password: "123456" },
    { id: 103, name: "خالد عبدالله", email: "khaled@hotmail.com", type: "staff", password: "123456" }
];

// بيانات وهمية للإعارة
let borrowedBooks = [
    { userId: 101, bookId: 2, borrowDate: "2023-05-10", returnDate: "2023-05-24" },
    { userId: 103, bookId: 5, borrowDate: "2023-05-15", returnDate: "2023-05-29" }
];

// متغير لتخزين المستخدم الحالي
let currentUser = null;

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث الإحصائيات
    updateStats();
    
    // عرض الكتب
    displayBooks();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
});

// تحديث الإحصائيات
function updateStats() {
    document.getElementById('available-books').textContent = books.filter(book => book.available).length;
    document.getElementById('borrowed-books').textContent = borrowedBooks.length;
    document.getElementById('total-users').textContent = users.length;
}

// عرض الكتب في الجدول
function displayBooks(filteredBooks = books) {
    const tbody = document.querySelector('#books-table tbody');
    tbody.innerHTML = '';
    
    filteredBooks.forEach(book => {
        const tr = document.createElement('tr');
        
        // الحالة بناءً على التوفر
        const status = book.available ? 
            '<span class="available">متاح</span>' : 
            '<span class="not-available">معار</span>';
        
        // الإجراءات بناءً على التوفر
        const actions = book.available ? 
            '<button class="borrow-btn" data-id="' + book.id + '">إعارة</button>' : 
            '<button class="return-btn" data-id="' + book.id + '">إرجاع</button>';
        
        tr.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${status}</td>
            <td>${actions}</td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // إضافة مستمعي الأحداث لأزرار الإعارة والإرجاع
    document.querySelectorAll('.borrow-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            borrowBook(bookId);
        });
    });
    
    document.querySelectorAll('.return-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = parseInt(this.getAttribute('data-id'));
            returnBook(bookId);
        });
    });
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // التنقل بين الصفحات
    document.getElementById('home-link').addEventListener('click', showSection.bind(null, 'home'));
    document.getElementById('books-link').addEventListener('click', showSection.bind(null, 'books'));
    document.getElementById('borrow-link').addEventListener('click', showSection.bind(null, 'borrow'));
    document.getElementById('return-link').addEventListener('click', showSection.bind(null, 'return'));
    document.getElementById('login-link').addEventListener('click', showSection.bind(null, 'login'));
    
    // البحث عن الكتب
    document.getElementById('search-btn').addEventListener('click', searchBooks);
    document.getElementById('book-search').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') searchBooks();
    });
    
    // نموذج الإعارة
    document.getElementById('borrow-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processBorrowForm();
    });
    
    // نموذج الإرجاع
    document.getElementById('return-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processReturnForm();
    });
    
    // تسجيل الدخول
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        loginUser();
    });
}

// عرض القسم المحدد وإخفاء الآخرين
function showSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('main section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إظهار القسم المطلوب
    document.getElementById(sectionId + '-section').classList.add('active');
    
    // إذا كانت صفحة الكتب، قم بتحديث القائمة
    if (sectionId === 'books') {
        displayBooks();
    }
}

// البحث عن الكتب
function searchBooks() {
    const searchTerm = document.getElementById('book-search').value.toLowerCase();
    
    if (searchTerm.trim() === '') {
        displayBooks();
        return;
    }
    
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) || 
        book.author.toLowerCase().includes(searchTerm) ||
        book.category.toLowerCase().includes(searchTerm)
    );
    
    displayBooks(filteredBooks);
}

// معالجة نموذج الإعارة
function processBorrowForm() {
    const userId = parseInt(document.getElementById('user-id').value);
    const bookId = parseInt(document.getElementById('book-id').value);
    const borrowDate = document.getElementById('borrow-date').value;
    const returnDate = document.getElementById('return-date').value;
    
    // التحقق من وجود المستخدم والكتاب
    const user = users.find(u => u.id === userId);
    const book = books.find(b => b.id === bookId);
    
    if (!user) {
        alert('المستخدم غير موجود!');
        return;
    }
    
    if (!book) {
        alert('الكتاب غير موجود!');
        return;
    }
    
    if (!book.available) {
        alert('الكتاب غير متاح للإعارة!');
        return;
    }
    
    // تحديث حالة الكتاب
    book.available = false;
    
    // إضافة سجل الإعارة
    borrowedBooks.push({ userId, bookId, borrowDate, returnDate });
    
    // تحديث الإحصائيات وعرض الكتب
    updateStats();
    displayBooks();
    
    // إعادة تعيين النموذج
    document.getElementById('borrow-form').reset();
    
    alert('تمت عملية الإعارة بنجاح!');
}

// معالجة نموذج الإرجاع
function processReturnForm() {
    const userId = parseInt(document.getElementById('return-user-id').value);
    const bookId = parseInt(document.getElementById('return-book-id').value);
    const actualReturnDate = document.getElementById('actual-return-date').value;
    
    // البحث عن سجل الإعارة
    const borrowIndex = borrowedBooks.findIndex(
        b => b.userId === userId && b.bookId === bookId
    );
    
    if (borrowIndex === -1) {
        alert('لا يوجد سجل إعارة مطابق!');
        return;
    }
    
    // تحديث حالة الكتاب
    const book = books.find(b => b.id === bookId);
    if (book) book.available = true;
    
    // إزالة سجل الإعارة
    borrowedBooks.splice(borrowIndex, 1);
    
    // تحديث الإحصائيات وعرض الكتب
    updateStats();
    displayBooks();
    
    // إعادة تعيين النموذج
    document.getElementById('return-form').reset();
    
    alert('تمت عملية الإرجاع بنجاح!');
}

// تسجيل الدخول
function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    
    // البحث عن المستخدم
    const user = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.type === userType
    );
    
    if (user) {
        currentUser = user;
        alert(`مرحبًا ${user.name}! تم تسجيل الدخول بنجاح.`);
        showSection('home');
        
        // تحديث واجهة المستخدم بناءً على نوعه
        updateUIForUserType(user.type);
    } else {
        alert('بيانات الدخول غير صحيحة!');
    }
}

// تحديث الواجهة بناءً على نوع المستخدم
function updateUIForUserType(userType) {
    // إخفاء أو إظهار عناصر حسب الصلاحيات
    // يمكنك تخصيص هذا الجزء حسب احتياجاتك
    if (userType === 'student') {
        // قد يكون للطلاب صلاحيات محدودة
    } else if (userType === 'teacher' || userType === 'staff') {
        // قد يكون للمعلمين والموظفين صلاحيات إضافية
    }
    
    // إخفاء زر تسجيل الدخول بعد تسجيل الدخول
    document.getElementById('login-link').style.display = 'none';
}

// إعارة كتاب (وظيفة مساعدة)
function borrowBook(bookId) {
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً!');
        showSection('login');
        return;
    }
    
    const book = books.find(b => b.id === bookId);
    
    if (book && book.available) {
        document.getElementById('book-id').value = bookId;
        document.getElementById('user-id').value = currentUser.id;
        
        // تعيين التواريخ الافتراضية
        const today = new Date().toISOString().split('T')[0];
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
        const returnDate = twoWeeksLater.toISOString().split('T')[0];
        
        document.getElementById('borrow-date').value = today;
        document.getElementById('return-date').value = returnDate;
        
        showSection('borrow');
    } else {
        alert('الكتاب غير متاح للإعارة!');
    }
}

// إرجاع كتاب (وظيفة مساعدة)
function returnBook(bookId) {
    if (!currentUser) {
        alert('يجب تسجيل الدخول أولاً!');
        showSection('login');
        return;
    }
    
    const borrowRecord = borrowedBooks.find(b => b.bookId === bookId);
    
    if (borrowRecord) {
        document.getElementById('return-book-id').value = bookId;
        document.getElementById('return-user-id').value = borrowRecord.userId;
        document.getElementById('actual-return-date').value = new Date().toISOString().split('T')[0];
        
        showSection('return');
    } else {
        alert('لا يوجد سجل إعارة لهذا الكتاب!');
    }
}