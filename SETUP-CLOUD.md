# تفعيل الحساب السحابي لـ LanguWay English

تم إنشاء مشروع Supabase باسم `english-first` وكُتب عنوانه ومفتاحه العام في `supabase-config.js`.
بقيت الخطوات التي تحتاج حسابك أنت (لا أستطيع تنفيذها من عندي):

## 1) إنشاء جدول التقدّم (دقيقتان)
1. افتح https://supabase.com/dashboard ثم مشروع **english-first**.
2. من القائمة اليسرى: **SQL Editor** ثم **New query**.
3. الصق كامل محتوى الملف `SUPABASE_SETUP.sql` واضغط **Run**.
   بدون هذه الخطوة يعمل الموقع لكن لا يُحفظ التقدّم في السحابة، وتظهر رسالة: "The cloud database is not set up yet".

## 2) بعد نشر الموقع على Netlify
انسخ رابط موقعك (مثل `https://اسمك.netlify.app`) ثم في Supabase:
**Authentication ← URL Configuration**
- **Site URL**: رابط موقعك.
- **Redirect URLs**: أضف رابط موقعك نفسه.
هذا يجعل روابط تأكيد البريد وإعادة كلمة المرور تعمل.

## 3) (اختياري) الدخول بحساب Google
1. Google Cloud Console ← APIs & Services ← Credentials ← Create OAuth client ID (Web application).
2. في Authorized redirect URIs ضع الرابط الظاهر في Supabase: Authentication ← Providers ← Google.
3. انسخ Client ID و Client Secret إلى Supabase وفعّل Google.
4. افتح `supabase-config.js` وغيّر `google:false` إلى `google:true` ثم أعد النشر.

## 4) Apple / iCloud
يحتاج حساب Apple Developer المدفوع، لذلك لم يُفعَّل. الدخول بالبريد وبـ Google مجاني.

## تأكيد البريد (مهم)
التطبيق الآن ينشئ الحساب عبر دالة Supabase باسم `signup` (منشورة وفعّالة) فيدخل المستخدم مباشرة بعد التسجيل دون بريد تأكيد ودون حدّ إرسال الإيميلات.
مع ذلك أوقف **Confirm email** أيضًا: Authentication ← Sign In / Providers ← Email. (الحسابات القديمة غير المؤكدة تحتاج هذا الإيقاف أو الحذف.)
ملاحظة أمان: الدالة تنشئ حسابات مؤكدة دون إثبات ملكية البريد؛ هذا مقبول لتطبيق مجاني لكنه قابل للإساءة. للتشديد لاحقًا فعّل Captcha و **Prevent use of leaked passwords** (Authentication ← Sign In / Providers ← Email) — ينبّه Supabase حاليًا أن حماية كلمات المرور المسرّبة غير مفعّلة.

## النشر على Netlify (مجاني)
- الأسهل: افتح https://app.netlify.com/drop واسحب **مجلد** الموقع (بعد فك الضغط) إلى الصفحة.
- الملف `netlify.toml` يضبط الكاش والأمان تلقائيًا.

## التحديثات
عند نشر نسخة جديدة: غيّر رقم `CACHE` في `sw.js` (مثلًا v7). سيرى المستخدم رسالة "نسخة جديدة جاهزة" ولا يتم التحديث إلا بموافقته، وتقدّمه محفوظ.

## ملاحظات الإصدار الجديد
- كل الملفات في مجلد واحد فتعمل على Netlify و GitHub Pages.
- صورة الـ QR باسم `qr.png` بجانب `index.html` (مأخوذة من صورتك؛ تأكد أنها تفتح رابط التطبيق بعد النشر).
- غيّر `CACHE` في `sw.js` عند كل تحديث.

## الدخول كضيف وتثبيت الأندرويد
- زر "Continue as guest" في شاشة الدخول: يدخل المستخدم بلا حساب، وتُحفظ بياناته على الجهاز فقط. يظهر شريط أزرق ثابت في الأعلى "Sign in" ما دام ضيفًا، ويختفي عند تسجيل الدخول، وتُضاف بيانات الضيف إلى حسابه تلقائيًا.
- تثبيت الأندرويد: تأكد أن الموقع يعمل على https، ثم احذف التطبيق المثبّت القديم وامسح بيانات الموقع في Chrome وثبّته من جديد (يلزم لتحديث الـ manifest).

## فحص مشروعك (17 أكتوبر)
- في Auth يوجد حسابان وكلاهما غير مؤكد (Confirm email مفعّل) → هذا سبب الأخطاء. أوقفه كما هو موضح أعلاه، ثم احذف الحسابين أو أكّدهما.
- جدول `progress` غير موجود بعد → شغّل `SUPABASE_SETUP.sql` في SQL Editor وإلا لن تتم المزامنة بين الأجهزة.

## الإصدار ذو الـ30 مستوى
- المستويات 1–20: وحدتان لكل مستوى (المستويات القديمة 1–10 مقسومة إلى نصفين). المستويات 21–30: أربع وحدات (المستويات القديمة 11–20). بعد المستوى 30 يصل المتعلّم إلى C1.
- تقدّم المستخدمين القدامى يُرحَّل تلقائيًا (دالة `clean()` في `app.js`) دون فقدان أي درس.
- عند أول درس في كل مستوى يبدأ عدّاد "Day X of 14"، وعند اجتياز اختبار المستوى تظهر رسالة: ثناء (≤10 أيام)، Good job (11–14)، أو push yourself (>14).
- المستوى 21 يبدأ بمراجعة اختيارية لكل المستويات السابقة (Review checkpoint).
- قسم Stories: 30 حلقة (Cedar City) بلا موسيقى. الترجمة العربية اختيارية ومطفأة افتراضيًا (من شاشة Stories).
- هيكل الملفات: `index.html` + `style.css` + `app.js` + `story.js` + ملفات المحتوى. عند النشر ارفع كل الملفات الجديدة والمعدّلة (راجع README.md).

## تحديث التسجيل (v2 للدالة)
- سبب خطأ الدخول كان حسابات قديمة بنفس البريد: التسجيل يردّ "مسجّل مسبقًا" ثم يفشل الدخول بكلمة مرور مختلفة. الدالة `signup` (النسخة 2، منشورة على مشروعك) تستعيد الحسابات غير المؤكدة وغير المستعملة بكلمة المرور الجديدة تلقائيًا، وتردّ "exists" للحسابات المؤكدة فيطلب التطبيق كلمة مرورها أو "Forgot password?".
- نسخة الدالة موجودة في `supabase-function/signup.ts` إن احتجت لصقها يدويًا (Edge Functions ← signup، وأوقف Verify JWT).
- الـQR الجديد `qr.png` يفتح https://qrco.de/bh42CG : تأكد من موقع QR Code Generator أن هذا الرابط يشير إلى رابط تطبيقك بعد النشر.

---

## رمز تغيير كلمة المرور (6 أرقام) — خطوة لازمة مرة واحدة

التطبيق صار يستعيد كلمة المرور ويغيّرها **برمز من 6 أرقام يصل إلى الإيميل** (بدل الرابط الذي كان يفتح صفحة لا تظهر).
لكي يظهر الرمز داخل الرسالة عدّل قالب الرسالة في Supabase:

1. Supabase → **Authentication → Emails → Templates → Reset Password**.
2. اجعل **Subject**: `LanguWay English: your password code`
3. اجعل **Message body** (استبدل كل ما فيه):

```html
<div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #e3ebf0;border-radius:16px">
  <h2 style="color:#0b4aa8;margin:0 0 8px">LanguWay English</h2>
  <p>Use this code to set a new password:</p>
  <p style="font-size:34px;font-weight:800;letter-spacing:8px;color:#06183a;margin:12px 0">{{ .Token }}</p>
  <p style="color:#6b7486;font-size:13px">The code works for a short time. If you did not ask for it, ignore this email.</p>
</div>
```
4. اضغط Save. (الرمز يصل 6 أرقام افتراضيًا؛ التطبيق يقبل من 6 إلى 10.)

## أن يكون المُرسِل «موقعي» وليس Supabase

حاليًا الرسائل تُرسل من خدمة Supabase الافتراضية (حدّها نحو **2 رسالة في الساعة** فقط). وهذا مقبول مؤقتًا.
عندما تنشئ بريدًا خاصًا بموقعك:

1. Supabase → **Authentication → Emails → SMTP Settings → Enable Custom SMTP**.
2. خيارات مجانية: **Brevo** (300 رسالة/يوم)، أو **Resend** (يحتاج نطاقًا/دومين)، أو **Gmail** مع «App password».
3. ضع: Sender email = بريدك، Sender name = `LanguWay English`، ثم Host/Port/User/Password من مزوّد الخدمة.
4. بعد ذلك يرتفع حدّ الإرسال وتظهر الرسائل باسم موقعك.
