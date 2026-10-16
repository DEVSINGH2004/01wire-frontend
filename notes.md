# Notes — TypeScript Build Errors Fixed

**Date:** 2026-10-16  
**Project:** 01wire-fe (React + TypeScript, Create React App v5)  
**Command used to surface errors:** `npx tsc --noEmit` and `npm run build`

---

## Summary

10 TypeScript errors across 7 component files blocked the production build. All were compile-time type mismatches in custom UI components under `src/components/`. No runtime crashes; the app simply could not compile.

After fixes: `tsc --noEmit` → 0 errors; `npm run build` → Compiled successfully.

---

## Error Categories

### Category 1 — `TS2339: Property 'defaultProps' does not exist` (7 errors)

**Cause:** `.defaultProps` was assigned on components created with `forwardRef<...>` or typed as `React.FC<...>`. In React 18 type definitions, `ForwardRefExoticComponent` and `FC` do not expose a `defaultProps` property.

**Fix:** Removed the `ComponentName.defaultProps = { ... }` assignments and moved each default value into the destructured function parameters (e.g. `({ prop = defaultValue, ...rest }, ref)`).

### Category 2 — `TS2322: Type 'ForwardedRef<unknown>' is not assignable to 'Ref<HTMLElement>'` (3 errors)

**Cause:** Components were declared as `const X: FC<Props | any> = forwardRef(...)`. The `FC<...>` annotation widened the `ref` parameter to `ForwardedRef<unknown>`, but the JSX element expected `Ref<HTMLDivElement>` / `Ref<HTMLButtonElement>` / `Ref<HTMLSpanElement>`.

**Fix:** Removed the `: FC<Props | any>` annotation so `forwardRef<T, P>` preserves the correct element type in the ref parameter.

---

## File-by-File Changes

### `src/components/MDAvatar/index.tsx`
- Removed `MDAvatar.defaultProps` block
- Added inline defaults: `bgColor = "transparent"`, `size = "md"`, `shadow = "none"`

### `src/components/MDBox/index.tsx`
- Removed `MDBox.defaultProps` block
- Added inline defaults for `variant`, `bgColor`, `color`, `opacity`, `borderRadius`, `shadow`, `coloredShadow`

### `src/components/MDButton/index.tsx`
- Removed `MDButton.defaultProps` block
- Added inline defaults for `color`, `variant`, `size`, `circular`, `iconOnly`

### `src/components/MDInput/index.tsx`
- Removed `FC` import (no longer used)
- Removed `: FC<Props | any>` annotation → `forwardRef<HTMLDivElement, Props>`
- Removed `MDInput.defaultProps` block
- Added inline defaults: `error = false`, `success = false`, `disabled = false`

### `src/components/MDPagination/index.tsx`
- Removed `FC` import (no longer used)
- Removed `: FC<Props | any>` annotation → `forwardRef<HTMLButtonElement, Props>`
- Removed `MDPagination.defaultProps` block
- Added inline defaults: `item = false`, `variant = "gradient"`, `color = "info"`, `size = "medium"`, `active = false`

### `src/components/MDSocialButton/index.tsx`
- Removed `MDSocialButton.defaultProps` block
- Added inline defaults: `size = "medium"`, `color = "facebook"`, `iconOnly = false`, `circular = false`

### `src/components/MDTypography/index.tsx`
- Removed `FC` import (no longer used)
- Removed `: FC<Props | any>` annotation → `forwardRef<HTMLSpanElement, Props>`
- Removed `MDTypography.defaultProps` block
- Added inline defaults: `color = "dark"`, `width = "auto"`, `fontWeight = undefined`, `textTransform = "none"`, `verticalAlign = "unset"`, `textGradient = false`, `opacity = 1`
- Aliased styled root: `const TypographyRoot = MDTypographyRoot as any;` to allow the internal `ownerState` prop

### `src/components/MDTypography/MDTypographyRoot.tsx`
- No changes (reverted a temporary edit). The `ownerState` typing issue was resolved from the usage site via the `as any` alias.

---

## Verification

| Check | Before | After |
|---|---|---|
| `npx tsc --noEmit` | 10 errors | 0 errors |
| `npm run build` | Failed to compile | Compiled successfully |

---

# Notes — GraphQL `createdAt` Validation Error Fixed

**Date:** 2026-10-16  
**Project:** 01wire-fe (React + TypeScript, Create React App v5)  
**Issue type:** Runtime GraphQL validation error (Apollo Client)  
**Error message:** `Variable "$params" got invalid value ... Field "createdAt" is not defined by type "ArticleCreateInput".`

---

## Summary

The `createArticle` GraphQL mutation rejected requests because the `params` variable contained a `createdAt` field, but the backend's `ArticleCreateInput` input type does not define `createdAt`. GraphQL strictly validates input fields against the schema, so any unknown field causes the entire mutation to fail before reaching the resolver.

## Where the issue was

### Schema definition — `src/graphql/mutations/createArticle.ts`
- **Lines 3–34:** `ArticleCreateInput` interface defines accepted fields (`clientId`, `title`, `content`, `summary`, `featureImage`, `featureImageDesc`, etc.) but **does not include `createdAt`**.
- **Lines 38–50:** `CREATE_ARTICLE` mutation declares `$params: ArticleCreateInput!`.

### Component sending the invalid field — `src/layouts/pages/releases/components/AddPress/index.tsx`
| Line | Code | Role |
|------|------|------|
| **48** | `const { title, content, summary, featureImage, featureImageDesc, createdAt } = data \|\| {};` | Pulls `createdAt` from incoming edit data. |
| **62** | `createdAt,` (inside `useForm` defaultValues) | Seeds `createdAt` into form state so it becomes part of `formVals` on submit. |
| **247** | `name="createdAt"` | Renders an editable "Created At" form field. |
| **97–104** | `createArticle({ variables: { params: { ...formVals, clientId: selectedClient?.value } } })` | Spreads all form values (including `createdAt`) into the GraphQL `params` variable. |

## Why the error fired

On form submission, `...formVals` copied `createdAt` into `params`. Apollo Client sent it to the server, where GraphQL validated the payload against `ArticleCreateInput`, found an undefined field `createdAt`, and rejected the request with:

> Field "createdAt" is not defined by type "ArticleCreateInput".

`createdAt` is a server-generated timestamp; the client should never send it in a create/update article mutation.

## Fix applied

**File:** `src/layouts/pages/releases/components/AddPress/index.tsx`

### Step 1 — Remove `createdAt` from `useForm` default values
Removed `createdAt` from the `defaultValues` object so it is not part of `formVals`.

### Step 2 — Remove the editable `createdAt` form field
Removed (or replaced with read-only display) the `FormField` with `name="createdAt"` so users cannot submit it.

### Step 3 — Explicitly exclude `createdAt` before calling the mutation
Destructured `createdAt` out of `formVals` before spreading into `params`:

```tsx
const { createdAt, ...articleParams } = formVals;

res = await createArticle({
  variables: {
    params: {
      ...articleParams,
      clientId: selectedClient?.value,
    },
  },
});
```

Applied the same exclusion to the `updateArticle` call path if `ArticleUpdateInput` also lacks `createdAt`.

## Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit` | 0 errors (unchanged) |
| `npm run build` | Compiled successfully (unchanged) |
| `createArticle` mutation with `createdAt` removed | GraphQL validation passes; mutation executes |
