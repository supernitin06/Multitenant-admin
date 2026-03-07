# 🚀 Centralized API Configuration

This directory contains a centralized API configuration system that handles authentication across all RTK Query APIs.

## 📁 Files Structure

```
src/api/
├── base.api.js      # 🔥 Central auth configuration
├── auth.api.js      # Authentication endpoints
├── tenant.api.js    # Tenant management
├── plans.api.js     # Subscription plans
├── modules.api.js   # Module management
├── dashboard.api.js # Dashboard data
├── auditLogs.api.js # Audit logs
├── permission.api.js # Permissions
└── store.js         # Redux store configuration
```

## 🔐 Authentication Modes

### 🍪 Cookie-Based Auth (Available)
```javascript
// In base.api.js
const AUTH_MODE = 'COOKIES';
```
- **No token management** in frontend
- **Automatic cookie sending** with `credentials: "include"`
- **Backend handles** cookie setting/clearing
- **Clean code** - no Authorization headers

### 🔑 Token-Based Auth (Current - Active)
```javascript
// In base.api.js
const AUTH_MODE = 'TOKEN';
```
- **Uses localStorage** for token storage
- **Automatic Authorization headers**
- **Token management** handled in AuthContext
- **Perfect for APIs that return tokens**

## 🛠️ How to Create New APIs

1. **Import the base query:**
```javascript
import { createApi } from "@reduxjs/toolkit/query/react";
import { getBaseQuery } from "./base.api";
```

2. **Use the centralized base query:**
```javascript
export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: getBaseQuery(), // 🔥 Centralized auth
  tagTypes: ["MyData"],
  endpoints: (builder) => ({
    // Your endpoints here
  }),
});
```

3. **Add to store.js:**
```javascript
import { myApi } from "./my.api";

// Add to reducer
[myApi.reducerPath]: myApi.reducer,

// Add to middleware
myApi.middleware,
```

## 🎯 Benefits

- ✅ **Single source of truth** for authentication
- ✅ **Easy switching** between auth modes
- ✅ **Clean API files** - no repeated auth code
- ✅ **Centralized configuration** - change once, apply everywhere
- ✅ **Consistent behavior** across all APIs

## 🔄 Switching Auth Modes

Simply change the `AUTH_MODE` constant in `base.api.js`:

```javascript
const AUTH_MODE = 'COOKIES'; // or 'TOKEN'
```

That's it! All APIs will automatically use the new authentication method.

## 📝 Example API Usage

```javascript
// In any component
import { useGetTenantsQuery } from "../../api/tenant.api";

function MyComponent() {
  const { data, isLoading, error } = useGetTenantsQuery();
  
  // No auth handling needed - handled by base.api.js!
  
  return (
    // Your component JSX
  );
}
```

---

**🎉 Your APIs are now centralized and ready for production!**
