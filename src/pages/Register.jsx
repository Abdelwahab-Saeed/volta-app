export default function Register() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 flex justify-center items-center gap-2">
            تسجيل حساب
            <span className="text-blue-600 text-lg">+</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            نستخدم بياناتك الشخصية لتحسين تجربتك على الموقع
            <br />
            وتسهيل الوصول إلى حسابك.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 text-slate-700">
              الاسم بالكامل
            </label>
            <input
              type="text"
              placeholder="الاسم بالكامل"
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 text-slate-700">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-1 text-slate-700">
              الهاتف (اختياري)
            </label>
            <input
              type="tel"
              placeholder="الهاتف"
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 text-slate-700">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="كلمة المرور"
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1 text-slate-700">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              className="w-full rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="accent-blue-600" />
            <span>
              أوافق على{" "}
              <a href="#" className="text-blue-600 underline">
                الشروط وسياسة الخصوصية
              </a>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded transition"
          >
            تسجيل
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm mt-5 text-gray-600">
          هل لديك حساب بالفعل؟
          <a href="/login" className="text-blue-600 mr-1">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
}
