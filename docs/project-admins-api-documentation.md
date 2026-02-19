# توثيق APIs إدارة مشرفي المشاريع
# Project Admins API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة مشرفي المشاريع وصلاحياتهم. هذا النظام يُستخدم لإدارة المشرفين مثل الإنشاء، التحديث، الحذف، إضافة وإزالة الصلاحيات، والتحقق من صلاحيات المستخدمين. جميع المسارات تبدأ بـ `/api/v1/restful/project-admins`

This documentation covers all API endpoints related to project admins management and their permissions. This system is used to manage admins such as creating, updating, deleting, adding and removing permissions, and checking user permissions. All routes start with `/api/v1/restful/project-admins`

---

## جدول المحتويات | Table of Contents

1. [الحصول على جميع مشرفي المشاريع](#1-get-all-project-admins)
2. [الحصول على مشرف بواسطة معرف المستخدم](#2-get-project-admin-by-user-id)
3. [الحصول على مشرفين بواسطة الصلاحية](#3-get-project-admins-by-permission)
4. [التحقق من صلاحية مستخدم](#4-check-user-permission)
5. [الحصول على مشرف بواسطة المعرف](#5-get-project-admin-by-id)
6. [إنشاء مشرف مشروع جديد](#6-create-new-project-admin)
7. [تحديث مشرف المشروع](#7-update-project-admin)
8. [إضافة صلاحية لمشرف المشروع](#8-add-permission-to-project-admin)
9. [إزالة صلاحية من مشرف المشروع](#9-remove-permission-from-project-admin)
10. [حذف مشرف المشروع](#10-delete-project-admin)
11. [هيكل نموذج مشرفي المشاريع](#11-project-admin-model-structure)
12. [ملاحظات مهمة](#12-important-notes)

---

## 1. الحصول على جميع مشرفي المشاريع | Get All Project Admins

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/project-admins`
- **الوصف | Description:** الحصول على قائمة بجميع مشرفي المشاريع في النظام
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج (مصفوفة JSON) |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/project-admins?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "permissions": ["view_activity_logs", "create_activity_logs"],
      "is_developer": false,
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب مشرفي المشاريع بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على مشرف بواسطة معرف المستخدم | Get Project Admin by User ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/project-admins/user/:userId`
- **الوصف | Description:** الحصول على مشرف المشروع بواسطة معرف المستخدم الخاص به
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| userId | string (UUID) | نعم | معرف المستخدم |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/project-admins/user/660e8400-e29b-41d4-a716-446655440001
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "permissions": ["view_activity_logs", "create_activity_logs"],
    "is_developer": false,
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### استجابة عدم وجود المشرف | Not Found Response
```json
{
  "success": false,
  "data": null
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب مشرف المشروع بنجاح
- `400 Bad Request` - معرف المستخدم غير صالح (يجب أن يكون UUID)
- `404 Not Found` - مشرف المشروع غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 3. الحصول على مشرفين بواسطة الصلاحية | Get Project Admins by Permission

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/project-admins/permission/:permission`
- **الوصف | Description:** الحصول على جميع المشرفين الذين يمتلكون صلاحية معينة
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| permission | string | نعم | اسم الصلاحية (1-100 حرف) |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/project-admins/permission/view_activity_logs
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "permissions": ["view_activity_logs", "create_activity_logs"],
      "is_developer": false,
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "user_id": "660e8400-e29b-41d4-a716-446655440004",
      "permissions": ["view_activity_logs", "delete_activity_logs"],
      "is_developer": true,
      "created_at": "2026-02-18T08:00:00.000Z",
      "updated_at": "2026-02-18T08:00:00.000Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المشرفين بنجاح
- `400 Bad Request` - اسم الصلاحية غير صالح
- `500 Internal Server Error` - خطأ في الخادم

---

## 4. التحقق من صلاحية مستخدم | Check User Permission

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/project-admins/check/:userId/:permission`
- **الوصف | Description:** التحقق مما إذا كان مستخدم معين يمتلك صلاحية محددة
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| userId | string | نعم | معرف المستخدم (أرقام فقط، 1-50 حرف) |
| permission | string | نعم | اسم الصلاحية (1-100 حرف) |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/project-admins/check/123456789012345678/view_activity_logs
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "hasPermission": true
  }
}
```

### استجابة عدم وجود الصلاحية | No Permission Response
```json
{
  "success": true,
  "data": {
    "hasPermission": false
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم التحقق من الصلاحية بنجاح
- `400 Bad Request` - بيانات غير صحيحة
- `500 Internal Server Error` - خطأ في الخادم

---

## 5. الحصول على مشرف بواسطة المعرف | Get Project Admin by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/restful/project-admins/:id`
- **الوصف | Description:** الحصول على مشرف مشروع محدد بواسطة معرفه الفريد
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف مشرف المشروع |

### مثال على الطلب | Request Example
```http
GET /api/v1/restful/project-admins/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "permissions": ["view_activity_logs", "create_activity_logs"],
    "is_developer": false,
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب مشرف المشروع بنجاح
- `400 Bad Request` - معرف مشرف المشروع غير صالح (يجب أن يكون UUID)
- `404 Not Found` - مشرف المشروع غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. إنشاء مشرف مشروع جديد | Create New Project Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/project-admins`
- **الوصف | Description:** إنشاء مشرف مشروع جديد مع تحديد صلاحياته
- **مستوى الوصول | Access Level:** Private (owner)

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| user_id | string (UUID) | نعم | - | معرف المستخدم |
| permissions | string[] | اختياري | `[]` | قائمة الصلاحيات (كل صلاحية 1-100 حرف) |
| is_developer | boolean | اختياري | `false` | هل المشرف مطور |

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/project-admins
Content-Type: application/json

{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "permissions": ["view_activity_logs", "create_activity_logs", "update_activity_logs"],
  "is_developer": false
}
```

### مثال بدون صلاحيات | Without Permissions Example
```http
POST /api/v1/restful/project-admins
Content-Type: application/json

{
  "user_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "permissions": ["view_activity_logs", "create_activity_logs", "update_activity_logs"],
    "is_developer": false,
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| user_id | مفقود | معرف المستخدم مطلوب |
| user_id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| permissions | ليست مصفوفة | الصلاحيات يجب أن تكون مصفوفة |
| permissions[i] | طويلة جداً | الصلاحية يجب أن لا تزيد عن 100 حرف |
| is_developer | ليست منطقية | is_developer يجب أن يكون قيمة منطقية (true/false) |

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء مشرف المشروع بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو المستخدم مسجل مسبقاً كمشرف
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. تحديث مشرف المشروع | Update Project Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/restful/project-admins/:id`
- **الوصف | Description:** تحديث بيانات مشرف مشروع موجود (الصلاحيات أو حالة المطور)
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف مشرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| permissions | string[] | اختياري | قائمة الصلاحيات الجديدة (تستبدل القائمة الحالية) |
| is_developer | boolean | اختياري | هل المشرف مطور |

> **ملاحظة:** يجب توفير حقل واحد على الأقل للتحديث.

### مثال على الطلب | Request Example
```http
PUT /api/v1/restful/project-admins/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "permissions": ["view_activity_logs", "create_activity_logs", "delete_activity_logs"],
  "is_developer": true
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "changedRows": 1
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف مشرف المشروع يجب أن يكون UUID صالح |
| body | فارغ | يجب توفير بيانات للتحديث |
| permissions | ليست مصفوفة | الصلاحيات يجب أن تكون مصفوفة |
| is_developer | ليست منطقية | is_developer يجب أن يكون قيمة منطقية (true/false) |

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث مشرف المشروع بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو لم يتم توفير بيانات للتحديث
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. إضافة صلاحية لمشرف المشروع | Add Permission to Project Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/restful/project-admins/:id/permissions`
- **الوصف | Description:** إضافة صلاحية واحدة جديدة لمشرف المشروع
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف مشرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| permission | string | نعم | اسم الصلاحية المراد إضافتها (1-100 حرف) |

### مثال على الطلب | Request Example
```http
POST /api/v1/restful/project-admins/550e8400-e29b-41d4-a716-446655440000/permissions
Content-Type: application/json

{
  "permission": "delete_activity_logs"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "changedRows": 1
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف مشرف المشروع يجب أن يكون UUID صالح |
| permission | مفقود | الصلاحية مطلوبة |
| permission | طويلة جداً | الصلاحية يجب أن لا تزيد عن 100 حرف |

### رموز الاستجابة | Response Codes
- `200 OK` - تم إضافة الصلاحية بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو الصلاحية موجودة مسبقاً
- `500 Internal Server Error` - خطأ في الخادم

---

## 9. إزالة صلاحية من مشرف المشروع | Remove Permission from Project Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/project-admins/:id/permissions`
- **الوصف | Description:** إزالة صلاحية واحدة من مشرف المشروع
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف مشرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| permission | string | نعم | اسم الصلاحية المراد إزالتها (1-100 حرف) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/project-admins/550e8400-e29b-41d4-a716-446655440000/permissions
Content-Type: application/json

{
  "permission": "delete_activity_logs"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "changedRows": 1
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| id | تنسيق خاطئ | معرف مشرف المشروع يجب أن يكون UUID صالح |
| permission | مفقود | الصلاحية مطلوبة |
| permission | طويلة جداً | الصلاحية يجب أن لا تزيد عن 100 حرف |

### رموز الاستجابة | Response Codes
- `200 OK` - تم إزالة الصلاحية بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو الصلاحية غير موجودة
- `500 Internal Server Error` - خطأ في الخادم

---

## 10. حذف مشرف المشروع | Delete Project Admin

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/restful/project-admins/:id`
- **الوصف | Description:** حذف مشرف مشروع من النظام بشكل نهائي
- **مستوى الوصول | Access Level:** Private (owner)

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف مشرف المشروع |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/restful/project-admins/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": null
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم حذف مشرف المشروع بنجاح
- `400 Bad Request` - معرف مشرف المشروع غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 11. هيكل نموذج مشرفي المشاريع | Project Admin Model Structure

### جدول `project_admins`

| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| id | UUID | نعم | UUIDV4 (تلقائي) | معرف مشرف المشروع الفريد |
| user_id | UUID | لا | - | معرف المستخدم (فريد - NULL إذا تم حذف المستخدم) |
| permissions | STRING[] | نعم | `[]` | قائمة الصلاحيات |
| is_developer | BOOLEAN | نعم | `false` | هل المشرف مطور |
| created_at | TIMESTAMP | نعم | تلقائي | تاريخ إنشاء السجل |
| updated_at | TIMESTAMP | نعم | تلقائي | تاريخ آخر تحديث |

### الفهارس | Indexes

| اسم الفهرس | الحقل | النوع | الوصف |
|------------|-------|------|-------|
| unique_user_id | user_id | UNIQUE | ضمان عدم تكرار المستخدم كمشرف |

---

## 12. ملاحظات مهمة | Important Notes

### الصلاحيات | Permissions
- جميع المسارات تتطلب مصادقة (Authentication).
- جميع المسارات مقصورة على دور **owner** فقط.
- لا يمكن لأي مشرف (admin) الوصول إلى هذه المسارات.

### القيود الفريدة | Unique Constraints
- حقل `user_id` فريد - لا يمكن تسجيل نفس المستخدم كمشرف أكثر من مرة.
- إذا تم حذف المستخدم، يصبح `user_id` قيمة `NULL`.

### إدارة الصلاحيات | Permission Management
يوفر النظام ثلاث طرق لإدارة الصلاحيات:

1. **استبدال كامل:** عبر `PUT /:id` - يستبدل قائمة الصلاحيات بالكامل.
2. **إضافة فردية:** عبر `POST /:id/permissions` - يضيف صلاحية واحدة.
3. **إزالة فردية:** عبر `DELETE /:id/permissions` - يزيل صلاحية واحدة.

### التحقق من البيانات | Data Validation
- جميع معرفات المشرفين يجب أن تكون بصيغة **UUID**.
- معرف المستخدم في مسار التحقق من الصلاحية (`/check/:userId/:permission`) يقبل **أرقام فقط** (1-50 حرف).
- كل صلاحية يجب أن تكون نصاً بين **1 و 100 حرف**.
- حقل `is_developer` يجب أن يكون **قيمة منطقية** (`true` أو `false`).

### الترتيب الافتراضي | Default Ordering
- السجلات مرتبة افتراضياً حسب `created_at` تنازلياً (الأحدث أولاً).

### حدود الاستعلام | Query Limits
- الحد الأقصى لعدد النتائج في الطلب الواحد هو **200** سجل.
- يدعم النظام ترقيم الصفحات (Pagination) عبر `limit` و `offset`.

### قاعدة البيانات | Database
- يتم تخزين بيانات المشرفين في قاعدة بيانات **PostgreSQL**.
- اسم الجدول: `project_admins`.
