"# Implementation Plan — Project Cleanup and Verification

Clean up duplicated component files, remove helper scripts left over from the recovery phase, delete redundant planning documents in the components directories, and execute validation builds.

## User Review Required

> [!IMPORTANT]
> - **Removal of Duplicates**: We will delete the duplicated files and config files inside `src/components/city/` (such as `package.json`, `index.html`, `vite.config.js`, `main.jsx`, `index.css`, `task.md`, etc.). These files duplicate the root project setup and cause confusion/potential issues.
> - **Helper Script Deletion**: We will remove the large collection of recovery and diagnostics `.cjs` and `.js` files in the root folder that were created during the previous parsing/reconstruction.
> - **Unused Components**: We will remove unused components such as `CityArrival.jsx` (both copies) and `CityAtmosphere.jsx` (both copies) to keep the repository minimal and clean.

## Proposed Changes

### [Root Workspace](file:///c:/Users/User/Desktop/Portfolio)

#### [DELETE] [check-utf16.cjs](file:///c:/Users/User/Desktop/Portfolio/check-utf16.cjs)
#### [DELETE] [collect-all-lines.cjs](file:///c:/Users/User/Desktop/Portfolio/collect-all-lines.cjs)
#### [DELETE] [collect-deepspace-chunks.cjs](file:///c:/Users/User/Desktop/Portfolio/collect-deepspace-chunks.cjs)
#### [DELETE] [decode-recovered.cjs](file:///c:/Users/User/Desktop/Portfolio/decode-recovered.cjs)
#### [DELETE] [decode-recovered.js](file:///c:/Users/User/Desktop/Portfolio/decode-recovered.js)
#### [DELETE] [decompress-pb.cjs](file:///c:/Users/User/Desktop/Portfolio/decompress-pb.cjs)
#### [DELETE] [extract-app-step-1189.cjs](file:///c:/Users/User/Desktop/Portfolio/extract-app-step-1189.cjs)
#### [DELETE] [extract-deepspace-views.cjs](file:///c:/Users/User/Desktop/Portfolio/extract-deepspace-views.cjs)
#### [DELETE] [extract-step-988.cjs](file:///c:/Users/User/Desktop/Portfolio/extract-step-988.cjs)
#### [DELETE] [extract-step.cjs](file:///c:/Users/Us
<truncated 5779 bytes>