# توثيق APIs إدارة المشاريع
# Projects API Documentation

**الرابط الأساسي | Base URL:** `http://localhost:3003`

## نظرة عامة | Overview

هذا التوثيق يغطي جميع نقاط النهاية (APIs) المتعلقة بإدارة المشاريع. هذا النظام يُستخدم لإدارة المشاريع مثل الإنشاء، التحديث، الحذف، تتبع التقدم، إدارة فرق العمل، والحصول على الإحصائيات. جميع المسارات تبدأ بـ `/api/v1/projects`

This documentation covers all API endpoints related to projects management. This system is used to manage projects such as creating, updating, deleting, tracking progress, managing teams, and retrieving statistics. All routes start with `/api/v1/projects`

---

## جدول المحتويات | Table of Contents

1. [الحصول على جميع المشاريع](#1-get-all-projects)
2. [الحصول على إحصائيات المشاريع](#2-get-project-statistics)
3. [الحصول على مشاريع المستخدم](#3-get-projects-by-user-id)
4. [الحصول على مشاريع عضو فريق](#4-get-projects-by-team-member)
5. [الحصول على مشروع بواسطة المعرف](#5-get-project-by-id)
6. [إنشاء مشروع جديد](#6-create-new-project)
7. [تحديث مشروع](#7-update-project)
8. [إضافة عنصر تقدم](#8-add-progress-item)
9. [تحديث عنصر تقدم](#9-update-progress-item)
10. [إزالة عنصر تقدم](#10-remove-progress-item)
11. [تحديد عنصر تقدم كمكتمل](#11-mark-progress-completed)
12. [إلغاء اكتمال عنصر تقدم](#12-unmark-progress-completed)
13. [إضافة عضو فريق](#13-add-team-member)
14. [إزالة عضو فريق](#14-remove-team-member)
15. [حذف مشروع](#15-delete-project)
16. [هيكل نموذج المشاريع](#16-project-model-structure)
17. [ملاحظات مهمة](#17-important-notes)

---

## 1. الحصول على جميع المشاريع | Get All Projects

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/projects`
- **الوصف | Description:** الحصول على قائمة بجميع المشاريع مع إمكانية البحث والتصفية
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_projects`

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج (مصفوفة JSON) |
| search | string | اختياري | البحث في اسم المشروع |
| status | string | اختياري | تصفية حسب الحالة (`active`, `pending`, `completed`, `onhold`) |
| priority | string | اختياري | تصفية حسب الأولوية (`low`, `medium`, `high`, `urgent`) |
| user_id | string | اختياري | تصفية حسب معرف المستخدم (UUID) |

> **ملاحظة:** معاملات `search` و `status` و `priority` و `user_id` حصرية - يتم استخدام واحد فقط بالأولوية: search > status > priority > user_id

### مثال على الطلب | Request Example
```http
GET /api/v1/projects?limit=10&offset=0
Content-Type: application/json
```

### مثال على البحث | Search Example
```http
GET /api/v1/projects?search=موقع&limit=20
Content-Type: application/json
```

### مثال على التصفية حسب الحالة | Filter by Status Example
```http
GET /api/v1/projects?status=active&limit=10
Content-Type: application/json
```

### مثال على التصفية حسب الأولوية | Filter by Priority Example
```http
GET /api/v1/projects?priority=high&limit=10
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "موقع إلكتروني للشركة",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "progress": [
        { "id": "step1", "title": "التصميم", "percent": 100 },
        { "id": "step2", "title": "التطوير", "percent": 60 }
      ],
      "progress_completed": ["step1"],
      "price": 5000.00,
      "spent": 2000.00,
      "priority": "high",
      "status": "active",
      "deadline": "2026-06-01T00:00:00.000Z",
      "team": ["770e8400-e29b-41d4-a716-446655440002"],
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    }
  ],
  "count": 50,
  "nextOffset": 10,
  "left": 40
}
```

### وصف حقول الاستجابة | Response Fields Description
| الحقل | النوع | الوصف |
|-------|------|-------|
| data | array | مصفوفة المشاريع |
| count | number | العدد الإجمالي لجميع المشاريع |
| nextOffset | number | قيمة الـ offset التالية للصفحة القادمة |
| left | number | عدد المشاريع المتبقية بعد الـ offset الحالي |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المشاريع بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 2. الحصول على إحصائيات المشاريع | Get Project Statistics

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/projects/statistics`
- **الوصف | Description:** الحصول على إحصائيات شاملة للمشاريع تشمل العدد الإجمالي والتوزيع حسب الحالة
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_projects`

### مثال على الطلب | Request Example
```http
GET /api/v1/projects/statistics
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "total": 50,
    "byStatus": {
      "active": 15,
      "pending": 20,
      "completed": 10,
      "onhold": 5
    }
  }
}
```

### وصف حقول الاستجابة | Response Fields Description
| الحقل | النوع | الوصف |
|-------|------|-------|
| total | number | العدد الإجمالي للمشاريع |
| byStatus | object | توزيع عدد المشاريع حسب كل حالة |

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب الإحصائيات بنجاح
- `500 Internal Server Error` - خطأ في الخادم

---

## 3. الحصول على مشاريع المستخدم | Get Projects by User ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/projects/user/:userId`
- **الوصف | Description:** الحصول على جميع المشاريع التي يملكها مستخدم معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_projects`

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
GET /api/v1/projects/user/660e8400-e29b-41d4-a716-446655440001?limit=10&offset=0
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "موقع إلكتروني للشركة",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "progress": [],
      "progress_completed": [],
      "price": 5000.00,
      "spent": 0,
      "priority": "medium",
      "status": "pending",
      "deadline": "2026-06-01T00:00:00.000Z",
      "team": [],
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب مشاريع المستخدم بنجاح
- `400 Bad Request` - معرف المستخدم غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 4. الحصول على مشاريع عضو فريق | Get Projects by Team Member

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/projects/team/:adminId`
- **الوصف | Description:** الحصول على جميع المشاريع التي يشارك فيها مشرف معين كعضو فريق
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| adminId | string (UUID) | نعم | معرف المشرف |

### معاملات الاستعلام | Query Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| limit | number | اختياري | عدد النتائج المطلوبة (الحد الأقصى 200) |
| offset | number | اختياري | عدد النتائج المتجاوزة |
| order | string (JSON) | اختياري | ترتيب النتائج |

### مثال على الطلب | Request Example
```http
GET /api/v1/projects/team/770e8400-e29b-41d4-a716-446655440002?limit=10
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "موقع إلكتروني للشركة",
      "user_id": "660e8400-e29b-41d4-a716-446655440001",
      "progress": [
        { "id": "step1", "title": "التصميم", "percent": 100 }
      ],
      "progress_completed": ["step1"],
      "price": 5000.00,
      "spent": 2000.00,
      "priority": "high",
      "status": "active",
      "deadline": "2026-06-01T00:00:00.000Z",
      "team": ["770e8400-e29b-41d4-a716-446655440002"],
      "created_at": "2026-02-19T10:30:00.000Z",
      "updated_at": "2026-02-19T10:30:00.000Z"
    }
  ]
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب مشاريع الفريق بنجاح
- `400 Bad Request` - معرف المشرف غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 5. الحصول على مشروع بواسطة المعرف | Get Project by ID

### معلومات الطلب | Request Information
- **المسار | Route:** `GET /api/v1/projects/:id`
- **الوصف | Description:** الحصول على مشروع محدد بواسطة معرفه الفريد
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `view_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### مثال على الطلب | Request Example
```http
GET /api/v1/projects/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "موقع إلكتروني للشركة",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "progress": [
      { "id": "step1", "title": "التصميم", "percent": 100 },
      { "id": "step2", "title": "التطوير", "percent": 60 }
    ],
    "progress_completed": ["step1"],
    "price": 5000.00,
    "spent": 2000.00,
    "priority": "high",
    "status": "active",
    "deadline": "2026-06-01T00:00:00.000Z",
    "team": ["770e8400-e29b-41d4-a716-446655440002"],
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### رموز الاستجابة | Response Codes
- `200 OK` - تم جلب المشروع بنجاح
- `400 Bad Request` - معرف المشروع غير صالح (يجب أن يكون UUID)
- `404 Not Found` - المشروع غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 6. إنشاء مشروع جديد | Create New Project

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/projects`
- **الوصف | Description:** إنشاء مشروع جديد مع تحديد بياناته وفريق العمل
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `create_projects`

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| name | string | نعم | - | اسم المشروع (1-255 حرف) |
| user_id | string (UUID) | نعم | - | معرف المستخدم صاحب المشروع |
| progress | ProgressItem[] | اختياري | `[]` | قائمة مراحل التقدم |
| progress_completed | string[] | اختياري | `[]` | معرفات المراحل المكتملة |
| price | number | نعم | - | سعر المشروع (الحد الأدنى 0) |
| spent | number | اختياري | `0` | المبلغ المصروف (الحد الأدنى 0) |
| priority | string | اختياري | `"medium"` | الأولوية (`low`, `medium`, `high`, `urgent`) |
| status | string | اختياري | `"pending"` | الحالة (`active`, `pending`, `completed`, `onhold`) |
| deadline | date (ISO) | نعم | - | الموعد النهائي للمشروع |
| team | string[] (UUID) | اختياري | `[]` | معرفات المشرفين في الفريق |

### هيكل عنصر التقدم | Progress Item Structure
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| id | string | نعم | معرف عنصر التقدم (1-100 حرف) |
| title | string | نعم | عنوان عنصر التقدم (1-255 حرف) |
| percent | number | نعم | نسبة التقدم (0-100) |

### مثال على الطلب | Request Example
```http
POST /api/v1/projects
Content-Type: application/json

{
  "name": "موقع إلكتروني للشركة",
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "progress": [
    { "id": "step1", "title": "التصميم", "percent": 0 },
    { "id": "step2", "title": "التطوير", "percent": 0 },
    { "id": "step3", "title": "الاختبار", "percent": 0 }
  ],
  "price": 5000,
  "priority": "high",
  "status": "active",
  "deadline": "2026-06-01T00:00:00.000Z",
  "team": ["770e8400-e29b-41d4-a716-446655440002"]
}
```

### مثال بالحد الأدنى من البيانات | Minimal Example
```http
POST /api/v1/projects
Content-Type: application/json

{
  "name": "مشروع جديد",
  "user_id": "660e8400-e29b-41d4-a716-446655440001",
  "price": 3000,
  "deadline": "2026-08-01T00:00:00.000Z"
}
```

### الاستجابة المتوقعة | Expected Response
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "موقع إلكتروني للشركة",
    "user_id": "660e8400-e29b-41d4-a716-446655440001",
    "progress": [
      { "id": "step1", "title": "التصميم", "percent": 0 },
      { "id": "step2", "title": "التطوير", "percent": 0 },
      { "id": "step3", "title": "الاختبار", "percent": 0 }
    ],
    "progress_completed": [],
    "price": 5000.00,
    "spent": 0,
    "priority": "high",
    "status": "active",
    "deadline": "2026-06-01T00:00:00.000Z",
    "team": ["770e8400-e29b-41d4-a716-446655440002"],
    "created_at": "2026-02-19T10:30:00.000Z",
    "updated_at": "2026-02-19T10:30:00.000Z"
  }
}
```

### أخطاء التحقق المحتملة | Possible Validation Errors
| الحقل | الخطأ | الرسالة |
|-------|------|---------|
| name | مفقود | اسم المشروع مطلوب |
| name | طويل جداً | اسم المشروع يجب أن لا يزيد عن 255 حرف |
| user_id | مفقود | معرف المستخدم مطلوب |
| user_id | تنسيق خاطئ | معرف المستخدم يجب أن يكون UUID صالح |
| price | مفقود | السعر مطلوب |
| price | أقل من صفر | السعر يجب أن يكون 0 على الأقل |
| priority | قيمة غير صالحة | الأولوية يجب أن تكون واحدة من: low, medium, high, urgent |
| status | قيمة غير صالحة | الحالة يجب أن تكون واحدة من: active, pending, completed, onhold |
| deadline | مفقود | الموعد النهائي مطلوب |
| deadline | تنسيق خاطئ | الموعد النهائي يجب أن يكون بصيغة ISO |
| team[i] | تنسيق خاطئ | كل معرف مشرف يجب أن يكون UUID صالح |

### رموز الاستجابة | Response Codes
- `201 Created` - تم إنشاء المشروع بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو ناقصة
- `500 Internal Server Error` - خطأ في الخادم

---

## 7. تحديث مشروع | Update Project

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/projects/:id`
- **الوصف | Description:** تحديث بيانات مشروع موجود
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| name | string | اختياري | اسم المشروع (1-255 حرف) |
| progress | ProgressItem[] | اختياري | قائمة مراحل التقدم (تستبدل القائمة الحالية) |
| progress_completed | string[] | اختياري | معرفات المراحل المكتملة |
| price | number | اختياري | سعر المشروع (الحد الأدنى 0) |
| spent | number | اختياري | المبلغ المصروف (الحد الأدنى 0) |
| priority | string | اختياري | الأولوية (`low`, `medium`, `high`, `urgent`) |
| status | string | اختياري | الحالة (`active`, `pending`, `completed`, `onhold`) |
| deadline | date (ISO) | اختياري | الموعد النهائي |
| team | string[] (UUID) | اختياري | معرفات المشرفين في الفريق |

> **ملاحظة:** يجب توفير حقل واحد على الأقل للتحديث.

### مثال على الطلب | Request Example
```http
PUT /api/v1/projects/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "status": "completed",
  "spent": 4500,
  "priority": "medium"
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث المشروع بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو لم يتم توفير بيانات للتحديث
- `500 Internal Server Error` - خطأ في الخادم

---

## 8. إضافة عنصر تقدم | Add Progress Item

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/projects/:id/progress`
- **الوصف | Description:** إضافة عنصر تقدم جديد لمشروع معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| item | object | نعم | بيانات عنصر التقدم |
| item.id | string | نعم | معرف عنصر التقدم (1-100 حرف) |
| item.title | string | نعم | عنوان عنصر التقدم (1-255 حرف) |
| item.percent | number | نعم | نسبة التقدم (0-100) |

### مثال على الطلب | Request Example
```http
POST /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/progress
Content-Type: application/json

{
  "item": {
    "id": "step4",
    "title": "النشر والإطلاق",
    "percent": 0
  }
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم إضافة عنصر التقدم بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو عنصر التقدم موجود مسبقاً
- `500 Internal Server Error` - خطأ في الخادم

---

## 9. تحديث عنصر تقدم | Update Progress Item

### معلومات الطلب | Request Information
- **المسار | Route:** `PUT /api/v1/projects/:id/progress/:itemId`
- **الوصف | Description:** تحديث عنصر تقدم موجود في مشروع معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |
| itemId | string | نعم | معرف عنصر التقدم (1-100 حرف) |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| title | string | اختياري | عنوان عنصر التقدم (1-255 حرف) |
| percent | number | اختياري | نسبة التقدم (0-100) |

> **ملاحظة:** يجب توفير حقل واحد على الأقل للتحديث.

### مثال على الطلب | Request Example
```http
PUT /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/progress/step2
Content-Type: application/json

{
  "percent": 85
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديث عنصر التقدم بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو عنصر التقدم غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 10. إزالة عنصر تقدم | Remove Progress Item

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/projects/:id/progress/:itemId`
- **الوصف | Description:** إزالة عنصر تقدم من مشروع معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |
| itemId | string | نعم | معرف عنصر التقدم (1-100 حرف) |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/progress/step4
Content-Type: application/json
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم إزالة عنصر التقدم بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو عنصر التقدم غير موجود
- `500 Internal Server Error` - خطأ في الخادم

---

## 11. تحديد عنصر تقدم كمكتمل | Mark Progress Completed

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/projects/:id/progress/complete`
- **الوصف | Description:** تحديد عنصر تقدم كمكتمل بإضافة معرفه إلى قائمة المراحل المكتملة
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| itemId | string | نعم | معرف عنصر التقدم (1-100 حرف) |

### مثال على الطلب | Request Example
```http
POST /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/progress/complete
Content-Type: application/json

{
  "itemId": "step2"
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم تحديد التقدم كمكتمل بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو العنصر مكتمل مسبقاً
- `500 Internal Server Error` - خطأ في الخادم

---

## 12. إلغاء اكتمال عنصر تقدم | Unmark Progress Completed

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/projects/:id/progress/uncomplete`
- **الوصف | Description:** إلغاء اكتمال عنصر تقدم بإزالة معرفه من قائمة المراحل المكتملة
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| itemId | string | نعم | معرف عنصر التقدم (1-100 حرف) |

### مثال على الطلب | Request Example
```http
POST /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/progress/uncomplete
Content-Type: application/json

{
  "itemId": "step2"
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم إلغاء اكتمال التقدم بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو العنصر غير مكتمل أصلاً
- `500 Internal Server Error` - خطأ في الخادم

---

## 13. إضافة عضو فريق | Add Team Member

### معلومات الطلب | Request Information
- **المسار | Route:** `POST /api/v1/projects/:id/team`
- **الوصف | Description:** إضافة مشرف كعضو فريق في مشروع معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| admin_id | string (UUID) | نعم | معرف المشرف المراد إضافته |

### مثال على الطلب | Request Example
```http
POST /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/team
Content-Type: application/json

{
  "admin_id": "770e8400-e29b-41d4-a716-446655440003"
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم إضافة عضو الفريق بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو العضو موجود مسبقاً في الفريق
- `500 Internal Server Error` - خطأ في الخادم

---

## 14. إزالة عضو فريق | Remove Team Member

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/projects/:id/team`
- **الوصف | Description:** إزالة مشرف من فريق العمل في مشروع معين
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `update_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### جسم الطلب | Request Body
| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| admin_id | string (UUID) | نعم | معرف المشرف المراد إزالته |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/projects/550e8400-e29b-41d4-a716-446655440000/team
Content-Type: application/json

{
  "admin_id": "770e8400-e29b-41d4-a716-446655440003"
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

### رموز الاستجابة | Response Codes
- `200 OK` - تم إزالة عضو الفريق بنجاح
- `400 Bad Request` - بيانات غير صحيحة أو العضو غير موجود في الفريق
- `500 Internal Server Error` - خطأ في الخادم

---

## 15. حذف مشروع | Delete Project

### معلومات الطلب | Request Information
- **المسار | Route:** `DELETE /api/v1/projects/:id`
- **الوصف | Description:** حذف مشروع من قاعدة البيانات بشكل نهائي
- **مستوى الوصول | Access Level:** Private (owner, admin) - يتطلب صلاحية `delete_projects`

### معاملات المسار | Path Parameters
| المعامل | النوع | مطلوب | الوصف |
|---------|------|-------|-------|
| id | string (UUID) | نعم | معرف المشروع |

### مثال على الطلب | Request Example
```http
DELETE /api/v1/projects/550e8400-e29b-41d4-a716-446655440000
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
- `200 OK` - تم حذف المشروع بنجاح
- `400 Bad Request` - معرف المشروع غير صالح (يجب أن يكون UUID)
- `500 Internal Server Error` - خطأ في الخادم

---

## 16. هيكل نموذج المشاريع | Project Model Structure

### جدول `projects`

| الحقل | النوع | مطلوب | القيمة الافتراضية | الوصف |
|-------|------|-------|-----------------|-------|
| id | UUID | نعم | UUIDV4 (تلقائي) | معرف المشروع الفريد |
| name | STRING(255) | نعم | - | اسم المشروع |
| user_id | UUID | نعم | - | معرف المستخدم صاحب المشروع |
| progress | JSONB | نعم | `[]` | قائمة مراحل التقدم `[{id, title, percent}]` |
| progress_completed | STRING[] | نعم | `[]` | معرفات المراحل المكتملة |
| price | DECIMAL(12,2) | نعم | `0` | سعر المشروع |
| spent | DECIMAL(12,2) | نعم | `0` | المبلغ المصروف |
| priority | ENUM | نعم | `"medium"` | الأولوية (`low`, `medium`, `high`, `urgent`) |
| status | ENUM | نعم | `"pending"` | الحالة (`active`, `pending`, `completed`, `onhold`) |
| deadline | DATE | نعم | - | الموعد النهائي للمشروع |
| team | UUID[] | نعم | `[]` | معرفات المشرفين في الفريق |
| created_at | TIMESTAMP | نعم | تلقائي | تاريخ إنشاء السجل |
| updated_at | TIMESTAMP | نعم | تلقائي | تاريخ آخر تحديث |

### هيكل عنصر التقدم | Progress Item Structure

| الحقل | النوع | مطلوب | الوصف |
|-------|------|-------|-------|
| id | string | نعم | معرف عنصر التقدم (1-100 حرف) |
| title | string | نعم | عنوان المرحلة (1-255 حرف) |
| percent | number | نعم | نسبة الإنجاز (0-100) |

### القيم المسموحة | Allowed Values

**الأولوية (Priority):**
| القيمة | الوصف |
|--------|-------|
| `low` | أولوية منخفضة |
| `medium` | أولوية متوسطة |
| `high` | أولوية عالية |
| `urgent` | أولوية عاجلة |

**الحالة (Status):**
| القيمة | الوصف |
|--------|-------|
| `active` | نشط - قيد العمل |
| `pending` | معلق - في الانتظار |
| `completed` | مكتمل |
| `onhold` | متوقف مؤقتاً |

### الفهارس | Indexes

| اسم الفهرس | الحقل | الوصف |
|------------|-------|-------|
| idx_project_user_id | user_id | لتسريع البحث حسب المستخدم |
| idx_project_status | status | لتسريع التصفية حسب الحالة |
| idx_project_priority | priority | لتسريع التصفية حسب الأولوية |
| idx_project_deadline | deadline | لتسريع الترتيب حسب الموعد النهائي |

---

## 17. ملاحظات مهمة | Important Notes

### الصلاحيات | Permissions
- جميع المسارات تتطلب مصادقة (Authentication).
- يتم التحقق من الدور (`owner` أو `admin`) والصلاحيات المحددة لكل عملية:
  - **عرض المشاريع:** `view_projects`
  - **إنشاء مشروع:** `create_projects`
  - **تحديث مشروع:** `update_projects` (يشمل إدارة التقدم والفريق)
  - **حذف مشروع:** `delete_projects`

### نظام تتبع التقدم | Progress Tracking System
يوفر النظام آلية مرنة لتتبع تقدم المشاريع:

1. **إضافة مراحل:** عبر `POST /:id/progress` - إضافة مرحلة جديدة.
2. **تحديث نسبة التقدم:** عبر `PUT /:id/progress/:itemId` - تعديل النسبة أو العنوان.
3. **إزالة مرحلة:** عبر `DELETE /:id/progress/:itemId` - حذف مرحلة.
4. **تحديد كمكتمل:** عبر `POST /:id/progress/complete` - تسجيل إتمام مرحلة.
5. **إلغاء الاكتمال:** عبر `POST /:id/progress/uncomplete` - التراجع عن إتمام مرحلة.

### إدارة فريق العمل | Team Management
- يمكن إضافة مشرفين (admins) كأعضاء فريق في المشروع.
- كل عضو يُحدد بمعرف UUID.
- يمكن إضافة/إزالة أعضاء فريق فردياً أو استبدال القائمة بالكامل عبر التحديث.

### التحقق من البيانات | Data Validation
- جميع المعرفات (المشروع، المستخدم، المشرف) يجب أن تكون بصيغة **UUID**.
- اسم المشروع يجب أن يكون بين **1 و 255 حرف**.
- السعر والمبلغ المصروف يجب أن يكونا **أرقام غير سالبة** (دقة عشرية 12,2).
- نسبة التقدم يجب أن تكون بين **0 و 100**.
- الموعد النهائي يجب أن يكون **تاريخ بصيغة ISO**.

### البحث والتصفية | Search & Filtering
- البحث باستخدام `search` يبحث في اسم المشروع (بحث غير حساس لحالة الأحرف).
- التصفية حسب `status` تدعم: `active`, `pending`, `completed`, `onhold`.
- التصفية حسب `priority` تدعم: `low`, `medium`, `high`, `urgent`.
- التصفية حسب `user_id` تجلب مشاريع مستخدم محدد.

### الترتيب الافتراضي | Default Ordering
- السجلات مرتبة افتراضياً حسب `created_at` تنازلياً (الأحدث أولاً)، ثم حسب `id` تصاعدياً.

### حدود الاستعلام | Query Limits
- الحد الأقصى لعدد النتائج في الطلب الواحد هو **200** سجل.
- يدعم النظام ترقيم الصفحات (Pagination) عبر `limit` و `offset`.

### قاعدة البيانات | Database
- يتم تخزين بيانات المشاريع في قاعدة بيانات **PostgreSQL**.
- اسم الجدول: `projects`.
- حقل `progress` يُخزن بصيغة **JSONB** للمرونة في الاستعلام.
