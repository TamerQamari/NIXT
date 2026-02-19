# توثيق APIs إدارة المستخدمين
# Users API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة المستخدمين. هذا النظام يُستخدم لإدارة المستخدمين مثل جلب البيانات، التحديث، الحذف، والبحث. يدعم النظام التسجيل عبر البريد الإلكتروني وكلمة المرور أو عبر Google OAuth2. جميع المسارات تبدأ بـ `/api/v1/users`

This documentation covers all API endpoints related to users management. This system is used to manage users such as fetching data, updating, deleting, and searching. The system supports registration via email and password or via Google OAuth2. All routes start with `/api/v1/users`

---

## جدول المحتويات | Table of Contents

1. [الحصول على جميع المستخدمين](#1-get-all-users)
2. [الحصول على مستخدم بواسطة البريد الإلكتروني](#2-get-user-by-email)
3. [الحصول على مستخدم بواسطة المعرف](#3-get-user-by-id)
4. [تحديث مستخدم](#4-update-user)
5. [حذف مستخدم](#5-delete-user)
6. [هيكل نموذج المستخدمين](#6-user-model-structure)
7. [ملاحظات مهمة](#7-important-notes)

---

## 1. الحصول على جميع المستخدمين | Get All Users

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/users`
- **الوصف | Description:** الحصول على قائمة بجميع المستخدمين مع إمكانية البحث والتصفية
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_users`

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج (مصفوفة JSON) |
| search | string | اختياري | البحث في الاسم أو البريد الإلكتروني |
| auth_provider | string | اختياري | تصفية حسب نوع المصادقة (`local`/`google`/`all`) |

> **ملاحظة:** البحث `search` يبحث في الحقول التالية: `email`, `display_name`, `first_name`, `last_name`

### مثال على الطلب | Request Example
```http
GET /api/v1/users?limit=10&offset=0
Content-Type: application/json
```

### مثال على البحث | Search Example
```http
GET /api/v1/users?search=ahmed&limit=20
Content-Type: application/json
```

### مثال على التصفية حسب نوع المصادقة | Filter by Auth Provider Example
```http
GET /api/v1/users?auth_provider=google&limit=10
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "auth_provider": "local",
      "google_id": null,
      "first_name": "أحمد",
      "last_name": "محمد",
      "display_name": "أحمد محمد",
      "avatar_url": null,
      "phone": "+966501234567",
      "email_verified": true,
      "created_at": "2025-01-15T10:30:00.000Z",
      "updated_at": "2025-01-15T10:30:00.000Z"
    }
  ],
  "count": 150,
  "nextOffset": 10,
  "left": 140
}
```

### وصف حقول الاستجابة | Response Fields Description
| الحقل | النوع | الوصف |
|-------|------|-------|
| data | array | مصفوفة المستخدمين |
| count | number | العدد الإجمالي لجميع المستخدمين |
| nextOffset | number | قيمة الـ offset التالية للصفحة القادمة |
| left | number | عدد المستخدمين المتبقيين بعد الـ offset الحالي |

> **ملاحظة:** حقل `password_hash` لا يتم تضمينه في الاستجابة لأسباب أمنية

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المستخدمين بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على مستخدم بواسطة البريد الإلكتروني | Get User by Email

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/users/email/:email`
- **الوصف | Description:** الحصول على مستخدم محدد بواسطة بريده الإلكتروني
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_users`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| email | string (email) | نعم | البريد الإلكتروني للمستخدم |

### مثال على الطلب | Request Example
```http
GET /api/v1/users/email/user@example.com
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "auth_provider": "local",
    "google_id": null,
    "first_name": "أحمد",
    "last_name": "محمد",
    "display_name": "أحمد محمد",
    "avatar_url": null,
    "phone": "+966501234567",
    "email_verified": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### استجابة عدم وجود المستخدم | Not Found Response
```json
{
  "success": false,
  "data": null
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| email | تنسيق خاطئ | البريد الإلكتروني غير صالح |
| email | مفقود | البريد الإلكتروني مطلوب |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المستخدم بنجاح
- `400 Bad Request` - البريد الإلكتروني غير صالح
- `404 Not Found` - المستخدم غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 3. الحصول على مستخدم بواسطة المعرف | Get User by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/users/:id`
- **الوصف | Description:** الحصول على مستخدم محدد بواسطة معرفه الفريد
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_users`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المستخدم |

### مثال على الطلب | Request Example
```http
GET /api/v1/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "auth_provider": "local",
    "google_id": null,
    "first_name": "أحمد",
    "last_name": "محمد",
    "display_name": "أحمد محمد",
    "avatar_url": null,
    "phone": "+966501234567",
    "email_verified": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-01-15T10:30:00.000Z"
  }
}
```

### استجابة عدم وجود المستخدم | Not Found Response
```json
{
  "success": false,
  "data": null
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| id | مفقود | معرف المستخدم مطلوب |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المستخدم بنجاح
- `400 Bad Request` - معرف المستخدم غير صالح (يجب أن يكون UUID)
- `404 Not Found` - المستخدم غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 4. تحديث مستخدم | Update User

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/users/:id`
- **الوصف | Description:** تحديث بيانات مستخدم محدد
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المستخدم |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| first_name | string | اختياري | الاسم الأول (1-100 حرف) |
| last_name | string | اختياري | اسم العائلة (1-100 حرف) |
| display_name | string | اختياري | اسم العرض (1-100 حرف) |
| avatar_url | string | اختياري | رابط الصورة الشخصية (URI صالح أو نص فارغ) |
| phone | string | اختياري | رقم الهاتف (7-20 رقمًا، يدعم +، أقواس، مسافات، وشرطات) |

> **ملاحظة:** يجب توفير حقل واحد على الأقل للتحديث

### مثال على الطلب | Request Example
```http
PUT /api/v1/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "first_name": "أحمد",
  "last_name": "علي",
  "display_name": "أحمد علي",
  "phone": "+966501234567"
}
```

### مثال على تحديث جزئي | Partial Update Example
```http
PUT /api/v1/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "display_name": "اسم جديد"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "auth_provider": "local",
    "google_id": null,
    "first_name": "أحمد",
    "last_name": "علي",
    "display_name": "أحمد علي",
    "avatar_url": null,
    "phone": "+966501234567",
    "email_verified": true,
    "created_at": "2025-01-15T10:30:00.000Z",
    "updated_at": "2025-02-19T14:20:00.000Z"
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| id | مفقود | معرف المستخدم مطلوب |
| first_name | ليس نصاً | الاسم الأول يجب أن يكون نصاً |
| first_name | قصير جداً | الاسم الأول يجب أن يكون على الأقل حرف واحد |
| first_name | طويل جداً | الاسم الأول يجب أن لا يزيد عن 100 حرف |
| last_name | ليس نصاً | اسم العائلة يجب أن يكون نصاً |
| last_name | قصير جداً | اسم العائلة يجب أن يكون على الأقل حرف واحد |
| last_name | طويل جداً | اسم العائلة يجب أن لا يزيد عن 100 حرف |
| display_name | ليس نصاً | اسم العرض يجب أن يكون نصاً |
| display_name | قصير جداً | اسم العرض يجب أن يكون على الأقل حرف واحد |
| display_name | طويل جداً | اسم العرض يجب أن لا يزيد عن 100 حرف |
| avatar_url | تنسيق خاطئ | رابط الصورة غير صالح |
| phone | تنسيق خاطئ | رقم الهاتف غير صالح |
| body | فارغ | يجب توفير بيانات للتحديث |

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث المستخدم بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو معرف المستخدم غير صالح
- `500 Internal Server Error` - خطأ في الخادم

---

## 5. حذف مستخدم | Delete User

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/users/:id`
- **الوصف | Description:** حذف مستخدم من النظام
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المستخدم |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/users/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": null
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| id | مفقود | معرف المستخدم مطلوب |

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف المستخدم بنجاح
- `400 Bad Request` - معرف المستخدم غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. هيكل نموذج المستخدمين | User Model Structure

### الحقول | Fields

| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| id | UUID | تلقائي | UUID v4 | معرف المستخدم الفريد |
| email | STRING(255) | نعم | - | البريد الإلكتروني (فريد) |
| password_hash | STRING(255) | لا | null | كلمة المرور المشفرة (فقط للتسجيل المحلي) |
| auth_provider | ENUM | نعم | 'local' | مزود المصادقة (`local`, `google`) |
| google_id | STRING(255) | لا | null | معرف Google الفريد |
| first_name | STRING(100) | لا | null | الاسم الأول |
| last_name | STRING(100) | لا | null | اسم العائلة |
| display_name | STRING(100) | لا | null | اسم العرض |
| avatar_url | TEXT | لا | null | رابط الصورة الشخصية |
| phone | STRING(20) | لا | null | رقم الهاتف |
| email_verified | BOOLEAN | نعم | false | هل تم التحقق من البريد الإلكتروني |
| created_at | TIMESTAMP | تلقائي | الوقت الحالي | تاريخ الإنشاء |
| updated_at | TIMESTAMP | تلقائي | الوقت الحالي | تاريخ آخر تحديث |

### الفهارس | Indexes

| الاسم | الحقول | النوع | الوصف |
|-------|--------|------|-------|
| unique_email | email | UNIQUE | فهرس فريد على البريد الإلكتروني |
| unique_google_id | google_id | UNIQUE (شرطي) | فهرس فريد على معرف Google (فقط عندما لا يكون null) |
| idx_auth_provider | auth_provider | INDEX | فهرس على نوع المصادقة |

### أنواع المصادقة | Auth Provider Types

| القيمة | الوصف |
|--------|-------|
| `local` | تسجيل عبر البريد الإلكتروني وكلمة المرور |
| `google` | تسجيل عبر Google OAuth2 |

### قواعد التحقق (Hooks) | Validation Rules (Hooks)

- عند التسجيل المحلي (`local`): يجب توفير `password_hash`
- عند التسجيل عبر Google (`google`): يجب توفير `google_id`
- عند التسجيل عبر Google: يتم تعيين `email_verified` إلى `true` تلقائياً

---

## 7. ملاحظات مهمة | Important Notes

1. **المصادقة | Authentication:** جميع المسارات تتطلب مصادقة JWT (يتم إرسال التوكن في الـ Header)
2. **الصلاحيات | Permissions:**
   - عمليات القراءة (GET) تتطلب صلاحية `view_users` ومتاحة للـ `owner` و `admin`
   - عمليات التحديث (PUT) متاحة فقط للـ `owner`
   - عمليات الحذف (DELETE) متاحة فقط للـ `owner`
3. **الأمان | Security:** حقل `password_hash` لا يتم تضمينه أبداً في استجابات الـ API
4. **الحد الأقصى للنتائج | Max Results:** الحد الأقصى لعدد النتائج في طلب واحد هو 200
5. **الترتيب الافتراضي | Default Order:** يتم ترتيب النتائج حسب `created_at` تنازلياً ثم `id` تصاعدياً
6. **البحث | Search:** البحث يتم في الحقول: `email`, `display_name`, `first_name`, `last_name` (غير حساس لحالة الأحرف)
7. **تصفية المصادقة | Auth Provider Filter:** استخدم `auth_provider=all` أو عدم تمرير المعامل لعرض جميع المستخدمين
8. **UUID:** جميع المعرفات تستخدم صيغة UUID v4
9. **التاريخ | Timestamps:** جميع التواريخ بصيغة ISO 8601
