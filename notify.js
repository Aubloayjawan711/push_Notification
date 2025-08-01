// متغير لتخزين حدث beforeinstallprompt حتى نستخدمه لاحقًا عند رغبة المستخدم في التثبيت
let deferredPrompt;

// الحصول على زر التثبيت من الصفحة بواسطة المعرف (id)
const installBtn = document.getElementById('installBtn');

// الاستماع لحدث beforeinstallprompt الذي يُطلق عندما يكون التطبيق مؤهلاً للتثبيت
window.addEventListener('beforeinstallprompt', (e) => {
  // منع المتصفح من عرض نافذة التثبيت الافتراضية
  e.preventDefault();

  // حفظ الحدث في متغير لاستخدامه لاحقًا عند الضغط على الزر
  deferredPrompt = e;

  // إظهار زر التثبيت للمستخدم (كان مخفيًا في البداية)
  installBtn.hidden = false;

  // عند ضغط المستخدم على زر التثبيت
  installBtn.addEventListener('click', () => {
    // إخفاء الزر مرة أخرى بعد الضغط عليه
    installBtn.hidden = true;

    // عرض نافذة التثبيت المخصصة للمستخدم
    deferredPrompt.prompt();

    // الانتظار لنتيجة اختيار المستخدم (هل وافق على التثبيت أم لا)
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        // إذا وافق المستخدم على التثبيت
        console.log('App installed');
      } else {
        // إذا رفض التثبيت (اختياري توضيح ذلك)
        console.log('App installation declined');
      }

      // إعادة تعيين المتغير بعد استخدامه
      deferredPrompt = null;
    });
  });
});


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('[SW] Registered:', reg))
    .catch(err => console.error('[SW] Error:', err));
}

document.getElementById('notifyBtn').addEventListener('click', async () => {
  const reg = await navigator.serviceWorker.ready;

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: '<YOUR_PUBLIC_VAPID_KEY>'
  });

  await fetch('php/save-subscription.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription)
  });

  alert('Subscribed for notifications!');
});
