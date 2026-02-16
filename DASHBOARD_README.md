# Dashboard Setup Guide

## نظرة عامة

تم إنشاء داشبورد مرن وقابل للتخصيص يمكن ربطه بـ API خاص بك. يتضمن الداشبورد الأقسام التالية:

- **نظرة عامة على المشروع**: تفاصيل المشروع والتقدم والميزانية
- **إحصائيات الأداء**: زيارات الموقع، الأداء التقني، معدلات التحويل
- **التقارير المالية**: المبيعات، الإيرادات، الفواتير، المعاملات
- **مركز الدعم**: تذاكر الدعم، الملاحظات، الاجتماعات

## إعداد الـ API

### 1. متغيرات البيئة

انسخ ملف `.env.local.example` إلى `.env.local` وقم بتحديث القيم:

```bash
cp .env.local.example .env.local
```

```env
# API Configuration  
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# Dashboard Configuration
NEXT_PUBLIC_DASHBOARD_REFRESH_INTERVAL=30000
```

### 2. Authentication (اختياري)

إذا كان الـ API يتطلب مفتاح توثيق، يمكنك حفظه في `localStorage`:

```javascript
localStorage.setItem('token', 'your-auth-token')
```

### 3. النقاط النهائية المطلوبة (API Endpoints)

يحتاج الداشبورد إلى النقاط النهائية التالية:

- `GET /dashboard/project` - بيانات المشروع
- `GET /dashboard/analytics` - إحصائيات الأداء  
- `GET /dashboard/financial` - التقارير المالية
- `GET /dashboard/support` - بيانات الدعم
- `POST /dashboard/support/tickets` - إنشاء تذكرة دعم جديدة
- `PUT /dashboard/settings` - حفظ إعدادات الداشبورد

راجع ملف `API_DOCUMENTATION.md` للتفاصيل الكاملة.

## الميزات

### 1. إمكانية التخصيص
- إظهار/إخفاء الأقسام حسب الحاجة
- إعدادات قابلة للحفظ
- واجهة سهلة الاستخدام

### 2. التحديث التلقائي
- الداشبورد يحدث البيانات تلقائياً
- يمكن تغيير فترة التحديث من الإعدادات

### 3. إدارة الأخطاء
- عرض حالات التحميل
- إظهار رسائل الأخطاء
- إعادة المحاولة التلقائية

### 4. Responsive Design
- يعمل على جميع الشاشات
- تصميم متجاوب
- سهولة الاستخدام على الجوال

## كيفية إضافة قسم جديد

### 1. إنشاء مكون جديد

```tsx
// components/Dashboard/NewSection.tsx
'use client'

import { FC } from 'react'
import { useApi } from '@/hooks/useApi'
import styles from './Dashboard.module.css'

const NewSection: FC = () => {
  const { data, loading, error } = useApi('/dashboard/new-endpoint')
  
  if (loading) return <div className={styles.loading}>Loading...</div>
  if (error) return <div className={styles.error}>Error: {error}</div>

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>القسم الجديد</h2>
      {/* محتوى القسم */}
    </div>
  )
}

export default NewSection
```

### 2. إضافة القسم للداشبورد

```tsx
// app/dashboard/page.tsx
import NewSection from '@/components/Dashboard/NewSection'

const [sections, setSections] = useState([
  // الأقسام الحالية...
  {
    id: 'new-section',
    name: 'القسم الجديد',
    component: NewSection,
    enabled: true
  }
])
```

## إزالة الأقسام

لإزالة قسم معين، احذف العنصر المقابل من array `sections` في ملف `app/dashboard/page.tsx`.

## التحكم في الأقسام من الـ API

يمكنك التحكم في الأقسام المعروضة من خلال الـ API:

```json
// GET /dashboard/settings
{
  "enabledSections": ["project", "analytics", "financial"],
  // باقي الإعدادات...
}
```

## استكشاف الأخطاء

### مشاكل شائعة:

1. **الـ API لا يستجيب**: تحقق من أن `NEXT_PUBLIC_API_URL` صحيح
2. **أخطاء التوثيق**: تأكد من وجود token في localStorage
3. **البيانات لا تظهر**: تحقق من أن النقاط النهائية ترجع البيانات بالشكل المطلوب

### سجلات الأخطاء:
افتح Developer Tools في المتصفح وتحقق من console للأخطاء.

## الاستخدام

1. انقر على "Demo Login" في الصفحة الرئيسية
2. ستنتقل إلى الداشبورد
3. استخدم أزرار التبديل لإظهار/إخفاء الأقسام
4. انقر على "⚙️ الإعدادات" لتخصيص الداشبورد
5. البيانات ستحدث تلقائياً من الـ API

## الدعم

إذا واجهت أي مشاكل في الإعداد أو الاستخدام، تأكد من:
- صحة عنوان الـ API
- توفر النقاط النهائية المطلوبة
- شكل البيانات المُرجعة من الـ API