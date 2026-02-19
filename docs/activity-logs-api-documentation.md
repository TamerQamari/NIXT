# توثيق APIs إدارة سجلات النشاط
# Activity Logs API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة سجلات النشاط. هذا النظام يُستخدم لتتبع نشاط المستخدمين داخل التطبيق مثل تسجيل زيارات الصفحات ومدة التصفح، بالإضافة إلى جلب الإحصائيات والبحث في السجلات. جميع المسارات تبدأ بـ `/api/v1/activity-logs`

This documentation covers all API endpoints related to activity logs management. This system is used to track user activity within the application such as recording page visits and browsing duration, along with retrieving statistics and searching logs. All routes start with `/api/v1/activity-logs`

---

## جدول المحتويات | Table of Contents

1. [الحصول على جميع سجلات النشاط](#1-get-all-activity-logs)
2. [الحصول على إحصائيات سجلات النشاط](#2-get-activity-log-statistics)
3. [الحصول على سجلات النشاط بواسطة معرف المستخدم](#3-get-activity-logs-by-user-id)
4. [الحصول على سجل نشاط بواسطة المعرف](#4-get-activity-log-by-id)
5. [إنشاء سجل نشاط جديد](#5-create-new-activity-log)
6. [تحديث سجل نشاط](#6-update-activity-log)
7. [حذف سجل نشاط](#7-delete-activity-log)
8. [هيكل نموذج سجلات النشاط](#8-activity-log-model-structure)
9. [ملاحظات مهمة](#9-important-notes)

---

## 1. الحصول على جميع سجلات النشاط | Get All Activity Logs

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/activity-logs`
- **الوصف | Description:** الحصول على قائمة بجميع سجلات النشاط مع إمكانية البحث والتصفية
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_activity_logs`

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج (مصفوفة JSON) |
| search | string | اختياري | البحث في الصفحة أو معرف المستخدم |
| userId | string | اختياري | تصفية حسب معرف المستخدم (UUID) |
| page | string | اختياري | تصفية حسب اسم الصفحة |

> **ملاحظة:** معاملات `search` و `userId` و `page` حصرية - يتم استخدام واحد فقط بالأولوية: search > userId > page

### مثال على الطلب | Request Example
```http
GET /api/v1/activity-logs?limit=10&offset=0
Content-Type: application/json
```

### مثال على البحث | Search Example
```http
GET /api/v1/activity-logs?search=dashboard&limit=20
Content-Type: application/json
```

### مثال على التصفية حسب المستخدم | Filter by User Example
```http
GET /api/v1/activity-logs?userId=550e8400-e29b-41d4-a716-446655440000&limit=10
Content-Type: application/json
```

### مثال على التصفية حسب الصفحة | Filter by Page Example
```http
GET /api/v1/activity-logs?page=dashboard&limit=10
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
      "duration": 120,
      "page": "dashboard",
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
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
| data | array | مصفوفة سجلات النشاط |
| count | number | العدد الإجمالي لجميع سجلات النشاط |
| nextOffset | number | قيمة الـ offset التالية للصفحة القادمة |
| left | number | عدد السجلات المتبقية بعد الـ offset الحالي |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب سجلات النشاط بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على إحصائيات سجلات النشاط | Get Activity Log Statistics

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/activity-logs/statistics`
- **الوصف | Description:** الحصول على إحصائيات شاملة لسجلات النشاط تشمل العدد الإجمالي والتوزيع حسب الصفحات
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_activity_logs`

### مثال على الطلب | Request Example
```http
GET /api/v1/activity-logs/statistics
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "total": 1500,
    "byPage": {
      "dashboard": 450,
      "settings": 200,
      "profile": 350,
      "home": 500
    }
  }
}
```

### وصف حقول الاستجابة | Response Fields Description
| الحقل | النوع | الوصف |
|-------|------|-------|
| total | number | العدد الإجمالي لسجلات النشاط |
| byPage | object | توزيع عدد السجلات حسب كل صفحة |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب الإحصائيات بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 3. الحصول على سجلات النشاط بواسطة معرف المستخدم | Get Activity Logs by User ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/activity-logs/user/:userId`
- **الوصف | Description:** الحصول على جميع سجلات النشاط لمستخدم معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_activity_logs`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| userId | string (UUID) | نعم | معرف المستخدم |

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج |

### مثال على الطلب | Request Example
```http
GET /api/v1/activity-logs/user/660e8400-e29b-41d4-a716-446655440001?limit=10&offset=0
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
      "duration": 120,
      "page": "dashboard",
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "duration": 60,
      "page": "settings",
      "created_at": "2026-02-19T09:15:00.000Z",
      "updated_at": "2026-02-19T09:15:00.000Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب سجلات النشاط بنجاح
- `400 Bad Request` - معرف المستخدم غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 4. الحصول على سجل نشاط بواسطة المعرف | Get Activity Log by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/activity-logs/:id`
- **الوصف | Description:** الحصول على سجل نشاط محدد بواسطة معرفه الفريد
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_activity_logs`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف سجل النشاط |

### مثال على الطلب | Request Example
```http
GET /api/v1/activity-logs/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "duration": 120,
    "page": "dashboard",
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب سجل النشاط بنجاح
- `400 Bad Request` - معرف سجل النشاط غير صالح (يجب أن يكون UUID)
- `404 Not Found` - سجل النشاط غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 5. إنشاء سجل نشاط جديد | Create New Activity Log

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/activity-logs`
- **الوصف | Description:** إنشاء سجل نشاط جديد لتسجيل زيارة المستخدم لصفحة معينة
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `create_activity_logs`

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| user_id | string (UUID) | نعم | معرف المستخدم |
| duration | number | نعم | مدة النشاط بالثواني (عدد صحيح، الحد الأدنى 0) |
| page | string | نعم | اسم الصفحة التي تم زيارتها (1-255 حرف) |

### مثال على الطلب | Request Example
```http
POST /api/v1/activity-logs
Content-Type: application/json

{
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "duration": 120,
  "page": "dashboard"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "duration": 120,
    "page": "dashboard",
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
| duration | مفقود | مدة النشاط مطلوبة |
| duration | ليس رقماً | مدة النشاط يجب أن تكون رقماً |
| duration | أقل من صفر | مدة النشاط يجب أن تكون 0 على الأقل |
| page | مفقود | اسم الصفحة مطلوب |
| page | طويل جداً | اسم الصفحة يجب أن لا يزيد عن 255 حرف |

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء سجل النشاط بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو ناقصة
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. تحديث سجل نشاط | Update Activity Log

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/activity-logs/:id`
- **الوصف | Description:** تحديث سجل نشاط موجود
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_activity_logs`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف سجل النشاط |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| user_id | string (UUID) | اختياري | معرف المستخدم |
| duration | number | اختياري | مدة النشاط بالثواني (عدد صحيح، الحد الأدنى 0) |
| page | string | اختياري | اسم الصفحة (1-255 حرف) |

> **ملاحظة:** يجب توفير حقل واحد على الأقل للتحديث.

### مثال على الطلب | Request Example
```http
PUT /api/v1/activity-logs/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "duration": 180,
  "page": "settings"
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
| id | تنسيق خاطئ | معرف سجل النشاط يجب أن يكون UUID صالح |
| body | فارغ | يجب توفير بيانات للتحديث |
| user_id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| duration | ليس رقماً | مدة النشاط يجب أن تكون رقماً |
| page | طويل جداً | اسم الصفحة يجب أن لا يزيد عن 255 حرف |

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث سجل النشاط بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو لم يتم توفير بيانات للتحديث
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. حذف سجل نشاط | Delete Activity Log

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/activity-logs/:id`
- **الوصف | Description:** حذف سجل نشاط من قاعدة البيانات
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `delete_activity_logs`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف سجل النشاط |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/activity-logs/550e8400-e29b-41d4-a716-446655440000
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
- `200 OK` - تم حذف سجل النشاط بنجاح
- `400 Bad Request` - معرف سجل النشاط غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. هيكل نموذج سجلات النشاط | Activity Log Model Structure

### جدول `activity_logs`

| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| id | UUID | نعم | UUIDV4 (تلقائي) | معرف سجل النشاط الفريد |
| user_id | UUID | نعم | - | معرف المستخدم |
| duration | INTEGER | نعم | - | مدة النشاط بالثواني (الحد الأدنى: 0) |
| page | STRING(255) | نعم | - | اسم الصفحة التي تم زيارتها |
| created_at | TIMESTAMP | نعم | تلقائي | تاريخ إنشاء السجل |
| updated_at | TIMESTAMP | نعم | تلقائي | تاريخ آخر تحديث |

### الفهارس | Indexes

| اسم الفهرس | الحقل | الوصف |
|------------|-------|-------|
| idx_activity_log_user_id | user_id | لتسريع البحث حسب المستخدم |
| idx_activity_log_page | page | لتسريع البحث حسب الصفحة |
| idx_activity_log_created_at | created_at | لتسريع الترتيب الزمني |

---

## 9. ملاحظات مهمة | Important Notes

### الصلاحيات | Permissions
- جميع المسارات تتطلب مصادقة (Authentication).
- يتم التحقق من الدور (`owner` أو `admin`) والصلاحيات المحددة لكل عملية:
  - **عرض السجلات:** `view_activity_logs`
  - **إنشاء سجل:** `create_activity_logs`
  - **تحديث سجل:** `update_activity_logs`
  - **حذف سجل:** `delete_activity_logs`

### التحقق من البيانات | Data Validation
- جميع معرفات السجلات والمستخدمين يجب أن تكون بصيغة **UUID**.
- مدة النشاط (`duration`) يجب أن تكون **عدداً صحيحاً** أكبر من أو يساوي صفر.
- اسم الصفحة (`page`) يجب أن يكون بين **1 و 255 حرف**.

### الترتيب الافتراضي | Default Ordering
- السجلات مرتبة افتراضياً حسب `created_at` تنازلياً (الأحدث أولاً)، ثم حسب `id` تصاعدياً.

### حدود الاستعلام | Query Limits
- الحد الأقصى لعدد النتائج في الطلب الواحد هو **200** سجل.
- يدعم النظام ترقيم الصفحات (Pagination) عبر `limit` و `offset`.

### البحث | Search
- البحث باستخدام معامل `search` يبحث في حقلي `page` و `user_id` (بحث غير حساس لحالة الأحرف).
- التصفية حسب الصفحة باستخدام `page` تستخدم مطابقة غير حساسة لحالة الأحرف (case-insensitive).

### قاعدة البيانات | Database
- يتم تخزين سجلات النشاط في قاعدة بيانات **PostgreSQL**.
- اسم الجدول: `activity_logs`.
