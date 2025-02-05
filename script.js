const stripe = Stripe('sk_test_51QoawJPAsFLDrstCA4Zmpj3D90o9atBNIvayzoYnLLxVjKOJCtrkGFgblWKPz3OyPeGuXudnXyMmSAobI9U5CALH00iPjcaLXX');
const bookList = document.querySelectorAll('.book-item');
const paymentModal = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');

bookList.forEach(item => {
    const button = item.querySelector('.buy-button');
    button.addEventListener('click', () => {
        paymentModal.style.display = 'block';
        // يمكنك تخصيص الكود هنا لإظهار الكتاب الذي تم اختياره
    });
});

paymentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // استخدم Stripe لإنشاء عملية الدفع
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    // هنا يتم إرسال بيانات الدفع إلى Stripe باستخدام API الخاص به
    const {token, error} = await stripe.createToken(cardNumber, {
        exp_month: expiryDate.split('/')[0],
        exp_year: expiryDate.split('/')[1],
        cvc: cvv,
    });

    if (error) {
        alert('حدث خطأ في الدفع');
    } else {
        // أرسل الرمز المميز إلى الخادم لمعالجة الدفع
        fetch('/process_payment', {
            method: 'POST',
            body: JSON.stringify({ token: token.id, amount: 100 }), // 1 دولار = 100 سنت
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json()).then(data => {
            if (data.success) {
                alert('تم الدفع بنجاح');
            } else {
                alert('فشل في الدفع');
            }
        });
    }
});
